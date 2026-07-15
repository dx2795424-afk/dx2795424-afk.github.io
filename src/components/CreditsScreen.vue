<template>
  <div class="credits-screen scene-frame scrollable">
    <h2 class="scene-title">史实与改编说明</h2>
    
    <div class="credits-intro">
      <p>本游戏基于苏轼生平、作品和相关研究材料进行互动化改编。</p>
      <p>以下说明帮助玩家区分史实与游戏改编。</p>
    </div>
    
    <div class="source-list">
      <div v-for="source in sources" :key="source.id" class="source-item" :class="{ historical: source.isHistoricalFact }">
        <h3 class="source-name">{{ source.name }}</h3>
        <p class="source-type">{{ source.type }}</p>
        <p class="source-link">{{ source.link }}</p>
        <p class="source-usage"><strong>使用位置：</strong>{{ source.usage }}</p>
        <p class="source-summary">{{ source.summary }}</p>
        <div class="source-tags">
          <span v-if="source.isHistoricalFact" class="tag fact">史实</span>
          <span v-if="!source.isHistoricalFact" class="tag adaptation">改编</span>
        </div>
      </div>
    </div>
    
    <div class="credits-note">
      <h3>重要声明</h3>
      <ul>
        <li>本游戏不把改编情节当作史实</li>
        <li>不虚构苏轼贪腐情节</li>
        <li>不以低俗化方式消费历史人物</li>
        <li>廉洁主题自然，不生硬说教</li>
      </ul>
    </div>
    
    <button class="btn btn-primary" @click="handleBack">返回结果页</button>
  </div>
</template>

<script setup>
import sourcesData from '../data/sources.json'
import { setScene } from '../store/gameState.js'

const sources = sourcesData.sources

function handleBack() {
  setScene('S50')
}
</script>

<style scoped>
.credits-screen {
  background: transparent;
  padding: 1.5rem;
}

.scene-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--moon-white);
  margin-bottom: 1.5rem;
  text-align: center;
}

.credits-intro {
  background: rgba(61, 79, 95, 0.2);
  border-left: 2px solid var(--old-gold);
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.credits-intro p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(232, 228, 223, 0.8);
  margin-bottom: 0.5rem;
}

.credits-intro p:last-child {
  margin-bottom: 0;
}

.source-list {
  margin-bottom: 1.5rem;
}

.source-item {
  background: rgba(26, 26, 26, 0.6);
  border: 1px solid rgba(232, 228, 223, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.source-item.historical {
  border-left: 3px solid var(--bamboo-green);
}

.source-name {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--moon-white);
  margin-bottom: 0.5rem;
}

.source-type {
  font-size: 0.6875rem;
  color: var(--old-gold);
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.source-link {
  font-size: 0.75rem;
  color: rgba(232, 228, 223, 0.5);
  margin-bottom: 0.5rem;
}

.source-usage {
  font-size: 0.8125rem;
  color: rgba(232, 228, 223, 0.7);
  margin-bottom: 0.5rem;
}

.source-usage strong {
  color: var(--old-gold);
}

.source-summary {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: rgba(232, 228, 223, 0.6);
  margin-bottom: 0.75rem;
}

.source-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  font-size: 0.625rem;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  letter-spacing: 0.05em;
}

.tag.fact {
  background: rgba(92, 122, 92, 0.3);
  color: var(--bamboo-green);
}

.tag.adaptation {
  background: rgba(184, 149, 108, 0.3);
  color: var(--old-gold);
}

.credits-note {
  background: rgba(139, 58, 58, 0.1);
  border: 1px solid rgba(139, 58, 58, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.credits-note h3 {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--vermillion);
  margin-bottom: 0.75rem;
}

.credits-note ul {
  list-style: none;
  padding: 0;
}

.credits-note li {
  font-size: 0.95rem;
  line-height: 1.8;
  color: rgba(232, 228, 223, 0.8);
  padding-left: 1rem;
  position: relative;
}

.credits-note li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--vermillion);
}

.btn-primary {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  display: block;
  background: var(--vermillion);
}
</style>
