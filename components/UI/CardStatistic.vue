<template>
  <!-- From Uiverse.io by themrsami -->
  <button class="card-statistic group">
    <div class="card-statistic__blur"></div>
    <div class="card-statistic__container">
      <div class="card-statistic__main">
        <div class="card-statistic__icon-wrapper">
          <div class="card-statistic__icon-blur"></div>
          <svg
            stroke="currentColor"
            viewBox="0 0 24 24"
            fill="none"
            class="card-statistic__icon"
          >
            <path
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
            ></path>
          </svg>
        </div>
        <div class="card-statistic__info">
          <div class="card-statistic__info-row">
            <span class="card-statistic__percentage">89.3%</span>
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              class="card-statistic__arrow"
            >
              <path
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>
          </div>
          <span class="card-statistic__label">Performance</span>
        </div>
      </div>
      <div class="card-statistic__stats">
        <div class="card-statistic__bars">
          <div class="card-statistic__bar-group">
            <div class="card-statistic__bar-outer">
              <div class="card-statistic__bar-inner card-statistic__bar-inner--cpu"></div>
            </div>
            <span class="card-statistic__bar-label">CPU</span>
          </div>
          <div class="card-statistic__bar-group">
            <div class="card-statistic__bar-outer">
              <div class="card-statistic__bar-inner card-statistic__bar-inner--mem"></div>
            </div>
            <span class="card-statistic__bar-label">MEM</span>
          </div>
        </div>
        <div class="card-statistic__status">
          <div class="card-statistic__status-dot"></div>
          <span class="card-statistic__status-label">ONLINE</span>
        </div>
      </div>
      <div class="card-statistic__line card-statistic__line--bottom"></div>
      <div class="card-statistic__line card-statistic__line--top"></div>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.card-statistic {
  position: relative;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;

  &__blur {
    position: absolute;
    inset: -4px;
    border-radius: 16px;
    background: linear-gradient(90deg, #14b8a6 0%, #10b981 50%, #22c55e 100%);
    opacity: 0.2;
    filter: blur(16px);
    transition: opacity 0.5s, filter 0.5s;
    z-index: 0;
    pointer-events: none;
  }

  &:hover .card-statistic__blur {
    opacity: 0.5;
    filter: blur(32px);
  }

  &__container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    border-radius: 16px;
    border: 1px solid #1e293b;
    background: #020617;
    padding: 4px 16px 4px 4px;
    z-index: 1;
    min-width: 320px;
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.5);
    padding: 8px 12px;
    position: relative;
  }

  &__icon-wrapper {
    position: relative;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon-blur {
    position: absolute;
    inset: -4px;
    border-radius: 8px;
    background: rgba(20, 184, 166, 0.2);
    filter: blur(8px);
    transition: background 0.3s, filter 0.3s;
    z-index: 0;
    pointer-events: none;
  }

  .group:hover &__icon-blur {
    background: rgba(20, 184, 166, 0.3);
    filter: blur(16px);
  }

  &__icon {
    position: relative;
    width: 24px;
    height: 24px;
    color: #14b8a6;
    z-index: 1;
    display: block;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__info-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__percentage {
    font-size: 1.125rem;
    font-weight: bold;
    color: #fff;
  }

  &__arrow {
    width: 16px;
    height: 16px;
    color: #10b981;
    transition: transform 0.3s;
    display: block;
  }

  .group:hover &__arrow {
    transform: translateY(-2px);
  }

  &__label {
    font-size: 10px;
    font-weight: 500;
    color: #94a3b8;
  }

  &__stats {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__bars {
    display: flex;
    gap: 12px;
  }

  &__bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  &__bar-outer {
    height: 32px;
    width: 6px;
    border-radius: 6px;
    background: #1e293b;
    padding: 2px;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
  }

  &__bar-inner {
    width: 100%;
    border-radius: 6px;
    transition: height 0.3s;
  }

  &__bar-inner--cpu {
    height: 16px;
    background: rgba(16, 185, 129, 0.5);
  }

  .group:hover &__bar-inner--cpu {
    height: 24px;
  }

  &__bar-inner--mem {
    height: 24px;
    background: rgba(20, 184, 166, 0.5);
  }

  .group:hover &__bar-inner--mem {
    height: 28px;
  }

  &__bar-label {
    font-size: 10px;
    font-weight: 500;
    color: #94a3b8;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px 2px rgba(16, 185, 129, 0.5);
  }

  &__status-label {
    font-size: 12px;
    font-weight: 600;
    color: #cbd5e1;
  }

  &__line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }

  &__line--bottom {
    bottom: -1px;
    background: linear-gradient(90deg, transparent, #14b8a6 50%, transparent);
  }

  &__line--top {
    top: -1px;
    background: linear-gradient(90deg, transparent, #10b981 50%, transparent);
  }

  .group:hover &__line {
    opacity: 1;
  }
}
</style>