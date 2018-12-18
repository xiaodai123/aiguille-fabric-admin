<template>
    <i :class="getIcon"></i>
</template>
<script>
import { FONT_IMG } from '~compJs/const';
export default {
    name: 'FontIcon',
    props: {
        icon: {
            type: String,
            required: true
        }
    },
    computed: {
        getIcon() {
            return FONT_IMG + this.icon;
        }
    }
}
</script>

