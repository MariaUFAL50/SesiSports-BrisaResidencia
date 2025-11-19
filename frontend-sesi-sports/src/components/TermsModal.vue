<template>
  <!-- Overlay backdrop -->
  <div v-if="isVisible" class="modal-overlay" @click="handleClose">
    <!-- Modal container -->
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Termo de compromisso</h2>
        <button
          class="close-btn"
          @click="handleClose"
          type="button"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="modal-content">
        <!-- Terms Text -->
        <div class="terms-text">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula 
            dolor in nulla luctus, a vestibulum magna pulvinar. Lorem ipsum dolor sit 
            amet, consectetur adipiscing elit. Donec vehicula dolor in nulla luctus, a 
            vestibulum magna pulvinar. Lorem ipsum dolor sit amet, consectetur 
            adipiscing elit. Donec vehicula dolor in nulla luctus, a vestibulum magna 
            pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec 
            vehicula dolor in nulla luctus, a vestibulum magna pulvinar. Lorem ipsum 
            dolor sit amet, consectetur adipiscing elit. Donec vehicula dolor in nulla 
            luctus, a vestibulum magna pulvinar. Lorem ipsum dolor sit amet, 
            consectetur adipiscing elit. Donec vehicula dolor in nulla luctus. Lorem 
            ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula dolor in 
            nulla luctus.
          </p>
        </div>

        <!-- Checkbox Agreement -->
        <div class="agreement-section">
          <div class="checkbox-container">
            <input 
              v-model="isAgreed" 
              id="terms-agreement"
              type="checkbox"
              class="terms-checkbox"
            />
            <label for="terms-agreement" class="checkbox-label">
              Li e concordo com os termos e condições
            </label>
          </div>
        </div>

        <!-- Action Button -->
        <div class="action-section">
          <button
            class="payment-btn"
            @click="handleProceed"
            :disabled="!isAgreed"
            type="button"
          >
            Seguir para o pagamento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:isVisible', 'proceed-to-payment']);

const isAgreed = ref(false);

const handleClose = () => {
  emit('update:isVisible', false);
  // Reset agreement when closing
  isAgreed.value = false;
};

const handleProceed = () => {
  if (isAgreed.value) {
    console.log('Usuário concordou com os termos, prosseguindo para pagamento...');
    emit('proceed-to-payment');
    handleClose();
  }
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

/* Modal Container */
.modal-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: none;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  flex: 1;
}

.close-btn {
  background-color: transparent;
  border: none;
  color: #6b7280;
  padding: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

/* Modal Content */
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

/* Terms Text */
.terms-text {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.terms-text p {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  margin: 0;
  text-align: justify;
}

/* Agreement Section */
.agreement-section {
  display: flex;
  align-items: center;
  padding: 16px 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.terms-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  accent-color: #4CAF50;
}

.terms-checkbox:hover {
  border-color: #4CAF50;
}

.terms-checkbox:checked {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  line-height: 1.4;
}

/* Action Section */
.action-section {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.payment-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-weight: 600;
  font-size: 14px;
  height: 48px;
  min-width: 200px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.payment-btn:hover:not(:disabled) {
  background-color: #388E3C;
}

.payment-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.payment-btn:disabled:hover {
  background-color: #9ca3af;
}

/* Scrollbar Styling */
.terms-text::-webkit-scrollbar,
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.terms-text::-webkit-scrollbar-track,
.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.terms-text::-webkit-scrollbar-thumb,
.modal-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.terms-text::-webkit-scrollbar-thumb:hover,
.modal-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-title {
    font-size: 18px;
  }
  
  .terms-text {
    max-height: 250px;
    padding: 12px;
  }
  
  .terms-text p {
    font-size: 13px;
  }
  
  .checkbox-label {
    font-size: 13px;
  }
  
  .payment-btn {
    min-width: 100%;
    padding: 12px 24px;
  }
  
  .modal-header {
    padding: 20px 20px 0 20px;
  }
  
  .modal-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .modal-title {
    font-size: 16px;
  }
  
  .terms-text {
    max-height: 200px;
    padding: 10px;
  }
  
  .modal-content {
    gap: 20px;
  }
  
  .agreement-section {
    padding: 12px 0;
  }
  
  .checkbox-container {
    gap: 10px;
  }
}

/* Focus States */
.terms-checkbox:focus {
  outline: 2px solid rgba(76, 175, 80, 0.2);
  outline-offset: 2px;
}

.close-btn:focus {
  outline: 2px solid rgba(76, 175, 80, 0.2);
  outline-offset: 2px;
}

.payment-btn:focus {
  outline: 2px solid rgba(76, 175, 80, 0.2);
  outline-offset: 2px;
}
</style>
