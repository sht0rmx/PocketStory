import { ref } from "vue";

export const useHoldAction = (onClick, onHold, delay = 300) => {
  const isHolding = ref(false);
  let timer = null;

  const start = (id) => {
    isHolding.value = false;
    timer = setTimeout(() => {
      isHolding.value = true;
      onHold(id);
    }, delay);
  };

  const cancel = (id) => {
    clearTimeout(timer);
    timer = null;

    if (!isHolding.value) {
      onClick(id);
    }
  };

  return { start, cancel };
};
