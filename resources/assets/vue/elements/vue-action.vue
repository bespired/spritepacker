<script>

	export default {

		props: ['item'],

		methods:{
			action: function(){
				if ( this.item.commit !== undefined )
				{
					if ( this.item.with !== undefined )
					{
						this.$store.commit(this.item.commit, this.item.with);
					}else{
						this.$store.commit(this.item.commit);
					}
				}
			},
		}
	}
</script>

<template>
	<div>
		<span class="label left-label">
			&nbsp;
		</span>
		<span class="right-entry" >
				<a class="button" @click="action">{{ item.label }}</a>
		</span>
	</div>
</template>
