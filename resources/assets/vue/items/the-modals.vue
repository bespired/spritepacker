<script>
	import TheNewProject   from '@vue/items/the-new-project.vue';
	import TheOpenProject  from '@vue/items/the-open-project.vue';
	import TheModalProtect from '@vue/items/the-modal-protect.vue';

	export default {
		components: {
			TheNewProject, TheOpenProject, TheModalProtect,
        },
    }
</script>

<template>
	<section>
		<the-modal-protect  v-if="this.$store.state.guix.modal != ''    "/>
		<the-new-project    v-if="this.$store.state.guix.modal == 'new' "/>
		<the-open-project   v-if="this.$store.state.guix.modal == 'open'"/>
	</section>
</template>
