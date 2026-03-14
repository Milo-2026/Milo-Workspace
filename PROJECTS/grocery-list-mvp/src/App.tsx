import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, FlatList, Modal, SafeAreaView, StatusBar } from 'react-native';
import { Item, DEFAULT_CATEGORIES, autoDetectCategory, sortItems, groupByCategory, generateId, createSampleList } from './data/store';

// Simple icons as Unicode
const CHECK_ICON = '✓';
const ADD_ICON = '+';
const DELETE_ICON = '🗑';
const SHARE_ICON = '🔗';
const BACK_ICON = '←';
const MIC_ICON = '🎤';

interface CategoryHeaderProps {
  category: string;
  count: number;
  completedCount: number;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, count, completedCount }) => {
  const cat = DEFAULT_CATEGORIES.find(c => c.id === category);
  const displayName = cat ? `${cat.icon} ${cat.name}` : category;
  
  return (
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryTitle}>
        {displayName} ({completedCount}/{count})
      </Text>
    </View>
  );
};

interface ItemRowProps {
  item: Item;
  onToggle: () => void;
  onDelete: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, onToggle, onDelete }) => (
  <TouchableOpacity 
    style={[styles.itemRow, item.completed && styles.itemCompleted]} 
    onPress={onToggle}
    onLongPress={onDelete}
  >
    <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
      {item.completed && <Text style={styles.checkboxText}>{CHECK_ICON}</Text>}
    </View>
    <View style={styles.itemInfo}>
      <Text style={[styles.itemName, item.completed && styles.itemNameCompleted]}>
        {item.name}
      </Text>
      <Text style={styles.itemQuantity}>
        {item.quantity} {item.unit}
      </Text>
    </View>
  </TouchableOpacity>
);

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, quantity: number, unit: string) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), parseInt(quantity) || 1, unit.trim());
      setName('');
      setQuantity('1');
      setUnit('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Item</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.modalInput}
            placeholder="Item name (e.g., Milk)"
            value={name}
            onChangeText={setName}
            autoFocus
          />
          
          <View style={styles.modalRow}>
            <TextInput
              style={[styles.modalInput, styles.modalHalf]}
              placeholder="Qty"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.modalInput, styles.modalHalf]}
              placeholder="Unit (optional)"
              value={unit}
              onChangeText={setUnit}
            />
          </View>
          
          <TouchableOpacity style={styles.modalAddButton} onPress={handleAdd}>
            <Text style={styles.modalAddText}>Add to List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function App() {
  const [list, setList] = useState<GroceryList>(createSampleList());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sortedItems = sortItems(list.items);
  const groupedItems = groupByCategory(sortedItems);

  const handleToggleItem = (itemId: string) => {
    setList(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
      updatedAt: new Date()
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    setList(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
      updatedAt: new Date()
    }));
  };

  const handleAddItem = (name: string, quantity: number, unit: string) => {
    const newItem: Item = {
      id: generateId(),
      name,
      quantity,
      unit,
      category: autoDetectCategory(name),
      completed: false,
      createdAt: new Date()
    };
    
    setList(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      updatedAt: new Date()
    }));
  };

  const completedCount = list.items.filter(i => i.completed).length;
  const totalCount = list.items.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{list.name}</Text>
          <Text style={styles.headerSubtitle}>
            {list.store && `🛒 ${list.store}`} • Updated {list.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareText}>{SHARE_ICON} Share</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }]} />
        </View>
        <Text style={styles.progressText}>{completedCount} of {totalCount} items</Text>
      </View>

      {/* Category Sections */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {DEFAULT_CATEGORIES.filter(cat => groupedItems[cat.id]?.length > 0).map(category => {
          const items = groupedItems[category.id] || [];
          const completedInCategory = items.filter(i => i.completed).length;
          
          return (
            <View key={category.id}>
              <CategoryHeader 
                category={category.id} 
                count={items.length} 
                completedCount={completedInCategory}
              />
              {items.map(item => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onToggle={() => handleToggleItem(item.id)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}
            </View>
          );
        })}
        
        {list.items.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add items to your list</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Add Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.fabText}>{ADD_ICON}</Text>
      </TouchableOpacity>

      {/* Voice Add Button (small, next to FAB) */}
      <TouchableOpacity style={styles.voiceButton}>
        <Text style={styles.voiceText}>{MIC_ICON}</Text>
      </TouchableOpacity>

      {/* Add Item Modal */}
      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#22C55E',
    borderRadius: 8,
  },
  shareText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  categoryHeader: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemCompleted: {
    backgroundColor: '#F9FAFB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    color: '#1F2937',
    fontWeight: '500',
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  voiceButton: {
    position: 'absolute',
    bottom: 24,
    right: 92,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  voiceText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalClose: {
    fontSize: 24,
    color: '#9CA3AF',
    padding: 4,
  },
  modalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalHalf: {
    flex: 1,
  },
  modalAddButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalAddText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});