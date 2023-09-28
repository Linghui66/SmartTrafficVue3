<template>
    <div>
        <h2 style="margin-block:10px;">温馨提示</h2>
        <div class="care">
            <p>让我们真诚地守卫交通安全，一天又一天让<br>我们执著地追逐幸福，一年又一年温馨是永远的<br>伴侣，平安是共同的心愿。</p>
            <h3 style="margin-block:10px;">智慧交通提醒您：</h3>
            <p>{{ list[Math.trunc(Math.random()*10)+1].masagess }}</p>
            
        </div>
    </div>
</template>

<script setup>
const list = [
    {id:1,
    masagess:"安全第一，遵守交通规则。"},
    {id:2,
    masagess:"让车先行，互相守望。"},
    {id:3,
    masagess:"不占用应急车道，以备紧急情况。"},
    {id:4,
    masagess:"切勿酒后驾驶，保护自己及他人。"},
    {id:5,
    masagess:"使用安全带，确保乘车安全。"},
    {id:6,
    masagess:"保持车辆状况良好，减少故障风险。"},
    {id:7,
    masagess:"不违规停车，避免交通拥堵。"},
    {id:8,
    masagess:"驾驶时专心、集中注意力。"},
    {id:9,
    masagess:"切勿超速驾驶，预防事故发生。"},
    {id:10,
    masagess:"行车谨慎，保持安全距离。"},

]
</script>

<style lang="scss" scoped>
.care {
    text-align: left;
    text-indent: 2em;
    margin: 30px 40px;
}
</style>