// Simple toast notifications - production ready with sonner/react-hot-toast later
export const toast = {
  success: (message) => {
    // Mock - replace with real toast library
    console.log('✅ Success:', message);
    // Create toast div or use native notification
  },
  error: (message) => {
    console.error('❌ Error:', message);
  },
};

export const showToast = (type, message) => {
  toast[type](message);
};

