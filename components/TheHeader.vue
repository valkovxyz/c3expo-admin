<template>
  <header class="bg-gray-900 border-b border-gray-800">
    <div class="h-16 px-6 flex justify-between items-center">
      <div class="flex items-center">
        <h2 class="text-xl font-semibold text-teal-400 flex items-center">
          <i class="fas fa-columns mr-2"></i>
          {{ currentPage }}
        </h2>
      </div>

      <div class="flex items-center space-x-4">
        <div class="text-gray-400 flex items-center">
          <i class="fas fa-user mr-2"></i>
          <span>Admin</span>
        </div>

        <button
            @click="logout"
            class="px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
                 transition-all duration-200 ease-in-out flex items-center group"
        >
          <i class="fas fa-sign-out-alt mr-2 group-hover:transform group-hover:-translate-x-0.5 transition-transform duration-200"></i>
          Logout
        </button>
      </div>
    </div>
  </header>
</template>