// Test script to verify important sentence functionality
import { dataService } from './src/services/dataService.js';

console.log('Testing Important Sentence Functionality...\n');

// Test 1: Get sentences for middle1
console.log('1. Getting sentences for middle1...');
const sentences = dataService.getSentencesByGrade('middle1');
console.log(`Found ${sentences.length} sentences for middle1`);

if (sentences.length > 0) {
  const firstSentence = sentences[0];
  console.log(`First sentence: ${firstSentence.korean} -> ${firstSentence.english}`);
  console.log(`Initially important: ${firstSentence.isImportant}`);
  
  // Test 2: Toggle important status
  console.log('\n2. Toggling important status...');
  dataService.toggleImportant(firstSentence.id);
  
  // Get updated sentence
  const updatedSentences = dataService.getSentencesByGrade('middle1');
  const updatedFirstSentence = updatedSentences[0];
  console.log(`After toggle, important: ${updatedFirstSentence.isImportant}`);
  
  // Test 3: Get important sentences
  console.log('\n3. Getting all important sentences...');
  const importantSentences = dataService.getImportantSentences();
  console.log(`Found ${importantSentences.length} important sentences`);
  
  if (importantSentences.length > 0) {
    console.log('Important sentences:');
    importantSentences.forEach((sentence, index) => {
      console.log(`  ${index + 1}. [${sentence.grade}] ${sentence.korean} -> ${sentence.english}`);
    });
  }
  
  // Test 4: Toggle back to test persistence
  console.log('\n4. Toggling back to test persistence...');
  dataService.toggleImportant(firstSentence.id);
  
  const finalSentences = dataService.getSentencesByGrade('middle1');
  const finalFirstSentence = finalSentences[0];
  console.log(`After second toggle, important: ${finalFirstSentence.isImportant}`);
  
  const finalImportantSentences = dataService.getImportantSentences();
  console.log(`Final important sentences count: ${finalImportantSentences.length}`);
  
  console.log('\n✅ Important sentence functionality test completed!');
} else {
  console.log('❌ No sentences found for testing');
}