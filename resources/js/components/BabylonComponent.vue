<template>
<canvas id="renderCanvas" ref="canvas"></canvas>    
</template>

<script>
import { BLApplication } from "../../ts/Application";

export default {
    props:{
        assetPath: ""
    },
    mounted() {
        let Application = new BLApplication(this.$refs.canvas, this.assetPath);
        // console.log();
    }
}
</script>

<style scoped>
#renderCanvas{
    width: 100%;
    height: 100%;
}

</style>