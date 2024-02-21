<script lang="ts">
    import {ActionState, currentActionState} from "$lib/types/Graphics";

    type Button = {
        icon: string,
        action: () => void
    }

    const buttons: Button[] = [
        {icon: "/point.svg", action: drawLine},
    ];

    function drawLine() {
        $currentActionState = ActionState.Drawing;
    }
</script>

<div id="container">
    {#each buttons as button, i}
        <div class="button" style="mask-image: url('{button.icon}')" on:click={button.action}>test</div>
    {/each}
</div>

<style>

    #container {
        position: absolute;
        display: flex;
        padding: .5em;
        background-color: white;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, .25);
        bottom: 1em;
        min-width: 400px;
        margin: 0 auto;
        left: 0;
        right: 0;
        width: min-content;
        border: 1px solid black;
        border-radius: .25em;
    }

    #container:hover {

    }

    .button {
        width: 2em;
        height: 2em;
        background-color: black;
        mask-size: 80%;
        mask-repeat: no-repeat;
        mask-position: center;
    }

    .button:hover {
        background-color: orange;
    }

</style>