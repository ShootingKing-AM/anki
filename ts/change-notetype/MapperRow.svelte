<!--
Copyright: Ankitects Pty Ltd and contributors
License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
-->
<script lang="ts">
    import Col from "../components/Col.svelte";
    import Row from "../components/Row.svelte";
    import Select from "../components/Select.svelte";
    import SelectOption from "../components/SelectOption.svelte";
    import type { ChangeNotetypeState, MapContext } from "./lib";

    export let state: ChangeNotetypeState;
    export let ctx: MapContext;
    export let newIndex: number;

    const info = state.info;

    let oldIndex = $info.getOldIndex(ctx, newIndex);

    const options = $info.getOldNamesIncludingNothing(ctx);
    $: state.setOldIndex(ctx, newIndex, oldIndex);
    $: label = options[oldIndex];
</script>

<Row --cols={2}>
    <Col --col-size={1}>
        <Select bind:value={oldIndex} {label}>
            {#each options as name, idx}
                <SelectOption value={idx}>{name}</SelectOption>
            {/each}
        </Select>
    </Col>
    <Col --col-size={1}>
        {$info.getNewName(ctx, newIndex)}
    </Col>
</Row>
