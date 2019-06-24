<template>
  <div class="card">
    <li v-for="(item, index) in data" :key="index">
      <slot :row='item'></slot>
    </li>
  </div>
</template>

<script>
export default {
  props: ['data']
}
</script>

<style>
.card {
  padding: 10px;
}
</style>
