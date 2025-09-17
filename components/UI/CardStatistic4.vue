<template>
  <!-- From Uiverse.io by army_6262 --> 
<div class="max-w-lg mx-auto">
  <div class="relative group">
    <div
      class="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-sky-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"
    ></div>

    <div class="relative bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl">
      <div class="flex items-center justify-between mb-6">
        <div class="space-y-1">
          <p
            class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent"
          >
            Premium Analytics
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Enterprise Dashboard
          </p>
        </div>

        <div
          class="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full"
        >
          <span
            class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
          ></span>
          <span
            class="text-sm text-emerald-600 dark:text-emerald-400 font-medium"
            >Active</span
          >
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <div
          class="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
        >
          <div class="relative z-10">
            <span
              class="block text-2xl font-bold text-emerald-600 dark:text-emerald-400"
              >97%</span
            >
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >Accuracy</span
            >
          </div>
          <div
            class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-sky-500"
          ></div>
        </div>

        <div
          class="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
        >
          <div class="relative z-10">
            <span
              class="block text-2xl font-bold text-sky-600 dark:text-sky-400"
              >3.2k</span
            >
            <span class="text-sm text-gray-600 dark:text-gray-400">Users</span>
          </div>
          <div
            class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-emerald-500"
          ></div>
        </div>

        <div
          class="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
        >
          <div class="relative z-10">
            <span
              class="block text-2xl font-bold text-emerald-600 dark:text-emerald-400"
              >+45%</span
            >
            <span class="text-sm text-gray-600 dark:text-gray-400">Growth</span>
          </div>
          <div
            class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-sky-500"
          ></div>
        </div>
      </div>

      <div class="space-y-4 mb-6">
        <div>
          <div
            class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1"
          >
            <span>Monthly Target</span>
            <span>78%</span>
          </div>
          <div
            class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
          >
            <div
              class="h-full w-[78%] bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full transform origin-left animate-expand"
            ></div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex space-x-2">
          <div
            class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center"
          >
            <span class="text-white text-xs font-medium">P1</span>
          </div>
          <div
            class="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center"
          >
            <span class="text-white text-xs font-medium">P2</span>
          </div>
        </div>

        <button
          class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-lg font-medium transform hover:scale-105 transition-transform"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
</div>

</template>