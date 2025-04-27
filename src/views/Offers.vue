<template>
  <div class="coming-soon">
    <div class="coming-soon__title gradient-text">Скоро...</div>
    <div class="coming-soon__text block">Совсем скоро здесь появится много заманчивых предложений, которые можно будет обменять на заработанные баллы!</div>
  </div>
</template>

<style scoped lang="scss">
.coming-soon {
  display: grid;
  position: relative;
  letter-spacing: -0.04em;
  line-height: 1;
  font-weight: 700;
  padding: 60px 25px;

  &__title {
    position: absolute;
    place-self: center;
    font-size: 36px;
  }

  &__text {
    max-width: 340px;
    border-radius: 16px;
    box-shadow: 0 4px 8px var(--theme-drop-shadow);
    font-size: 14px;
    place-self: end center;
    padding: 14px 24px;
  }
}
</style>
