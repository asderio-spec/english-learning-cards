// Simple test script to verify DataService functionality
// This is a temporary test file to verify the implementation

import { dataService } from './src/services/dataService.ts';

console.log('Testing DataService...');

// Test 1: Get sentences by grade
console.log('\n1. Testing getSentencesByGrade:');
const middle1Sentences = dataService.getSentencesByGrade('middle1');
console.log(`Middle 1 sentences count: ${middle1Sentences.length}`);
console.log(`First sentence: ${middle1Sentences[0]?.korean} -> ${middle1Sentences[0]?.english}`);

// Test 2: Toggle important
console.log('\n2. Testing toggleImportant:');
const firstSentenceId = middle1Sentences[0]?.id;
if (firstSentenceId) {
  console.log(`Before toggle - isImportant: ${middle1Sentences[0].isImportant}`);
  dataService.toggleImportant(firstSentenceId);
  
  const updatedSentences = dataService.getSentencesByGrade('middle1');
  console.log(`After toggle - isImportant: ${updatedSentences[0].isImportant}`);
}

// Test 3: Get important sentences
console.log('\n3. Testing getImportantSentences:');
const importantSentences = dataService.getImportantSentences();
console.log(`Important sentences count: ${importantSentences.length}`);

// Test 4: Get statistics
console.log('\n4. Testing getStatistics:');
const stats = dataService.getStatistics();
console.log('Statistics:', stats);

console.log('\nDataService tests completed successfully!');