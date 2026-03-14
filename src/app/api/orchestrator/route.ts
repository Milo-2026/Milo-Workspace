import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { AGENTS } from '@/lib/agents';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await request.json();
    const { goal, priority = 'normal', context = {} } = body;

    // 1. Create a proposal for the orchestrator agent
    const { data: orchestrator } = await supabaseAdmin
      .from('ops_agents')
      .select('id')
      .eq('name', 'orchestrator')
      .single();

    if (!orchestrator) {
      return NextResponse.json(
        { error: 'Orchestrator agent not found' },
        { status: 404 }
      );
    }

    // 2. Create proposal
    const { data: proposal, error: proposalError } = await supabaseAdmin
      .from('ops_mission_proposals')
      .insert({
        agent_id: orchestrator.id,
        title: goal,
        description: context.description || '',
        priority,
        status: 'approved' // Auto-approve orchestrator for now
      })
      .select()
      .single();

    if (proposalError) {
      return NextResponse.json(
        { error: proposalError.message },
        { status: 500 }
      );
    }

    // 3. Create mission
    const { data: mission, error: missionError } = await supabaseAdmin
      .from('ops_missions')
      .insert({
        proposal_id: proposal.id,
        title: goal,
        description: context.description || '',
        priority,
        status: 'running',
        metadata: context
      })
      .select()
      .single();

    if (missionError) {
      return NextResponse.json(
        { error: missionError.message },
        { status: 500 }
      );
    }

    // 4. Create initial event
    await supabaseAdmin.from('ops_agent_events').insert({
      agent_id: orchestrator.id,
      mission_id: mission.id,
      kind: 'mission_started',
      title: 'Mission Started',
      summary: `Goal: ${goal}`
    });

    return NextResponse.json({
      success: true,
      mission: {
        id: mission.id,
        title: mission.title,
        status: mission.status,
        created_at: mission.created_at
      },
      next_steps: [
        'Orchestrator will break down the goal into tasks',
        'Tasks will be assigned to specialized agents',
        'Progress will be tracked in ops_mission_steps'
      ]
    });

  } catch (error) {
    console.error('Orchestrator error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return mission status dashboard
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: missions } = await supabaseAdmin
      .from('ops_missions')
      .select('*, mission_steps(*), events(*)')
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: agents } = await supabaseAdmin
      .from('ops_agents')
      .select('*')
      .order('name');

    return NextResponse.json({
      missions: missions || [],
      agents: agents || [],
      fleet_status: {
        total_agents: agents?.length || 0,
        active_missions: missions?.filter((m: { status: string }) => m.status === 'running').length || 0
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard' },
      { status: 500 }
    );
  }
}
