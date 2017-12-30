<script>
	import VuePulldown  from '@vue/elements/vue-pulldown.vue';
	import VueCheckbox  from '@vue/elements/vue-checkbox.vue';
	import VueText      from '@vue/elements/vue-text.vue';
	import VueAction    from '@vue/elements/vue-action.vue';
	import slugify      from 'lodash-addons';

	export default {
		components: {

            vue_checkbox : VueCheckbox,
            vue_pulldown : VuePulldown,
            vue_text     : VueText,
            vue_action   : VueAction,

        },

        props: ['item'],

		data: function(){
			return {};
		}

    }
</script>

<template>
	<section class="vue-accordion">
		<div>
			<input class="accordion" type="checkbox" :id="item.accordion_slug" :checked="item.open"/>
			<label class="accordion" :for="item.accordion_slug">{{ item.label }}</label>
			<article>
				<ul class="list">
					<li v-for="(item, index) in item.panel" :key="index">
						 <span :is="`vue_${item.type}`" :item="item" />
					</li>
				</ul>
			</article>
		</div>
	</section>
</template>
