<template>
  <div class="flex items-center justify-center my-6">
    <div
      :class="[
        'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm',
        step >= 1 ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-600'
      ]"
    >
      1
    </div>
    <div
      :class="[
        'flex-grow h-0.5 mx-2',
        step >= 2 ? 'bg-primary-green' : 'bg-gray-300'
      ]"
    ></div>
    <div
      :class="[
        'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm',
        step >= 2 ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-600'
      ]"
    >
      2
    </div>
    <div
      :class="[
        'flex-grow h-0.5 mx-2',
        step >= 3 ? 'bg-primary-green' : 'bg-gray-300'
      ]"
    ></div>
    <div
      :class="[
        'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm',
        step >= 3 ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-600'
      ]"
    >
      3
    </div>
    <div
      :class="[
        'flex-grow h-0.5 mx-2',
        step >= 4 ? 'bg-primary-green' : 'bg-gray-300'
      ]"
    ></div>
    <div
      :class="[
        'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm',
        step >= 4 ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-600'
      ]"
    >
      4
    </div>
    </div>
</template>

<script setup>
// defineProps é um macro, não precisa ser importado explicitamente
const props = defineProps({
  step: {
    type: Number,
    required: true,
  },
});
</script>