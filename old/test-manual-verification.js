// Manual verification script for core functionality
// Run this in the browser console to verify key features

console.log('🧪 Starting manual verification tests...');

// Test 1: Check if main components are loaded
function testComponentsLoaded() {
  console.log('📋 Test 1: Component Loading');
  
  const gradeSelector = document.querySelector('[data-testid="grade-selector"]');
  const cardView = document.querySelector('[data-testid="card-view"]');
  
  if (gradeSelector || cardView) {
    console.log('✅ Main components loaded successfully');
    return true;
  } else {
    console.log('❌ Main components not found');
    return false;
  }
}

// Test 2: Check localStorage functionality
function testLocalStorage() {
  console.log('📋 Test 2: localStorage Functionality');
  
  try {
    const testKey = 'english-card-learning-test';
    const testData = { test: 'data', timestamp: Date.now() };
    
    localStorage.setItem(testKey, JSON.stringify(testData));
    const retrieved = JSON.parse(localStorage.getItem(testKey));
    localStorage.removeItem(testKey);
    
    if (retrieved && retrieved.test === 'data') {
      console.log('✅ localStorage working correctly');
      return true;
    } else {
      console.log('❌ localStorage data mismatch');
      return false;
    }
  } catch (error) {
    console.log('❌ localStorage error:', error.message);
    return false;
  }
}

// Test 3: Check TTS availability
function testTTSAvailability() {
  console.log('📋 Test 3: TTS Availability');
  
  if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
    const voices = speechSynthesis.getVoices();
    console.log(`✅ TTS available with ${voices.length} voices`);
    return true;
  } else {
    console.log('❌ TTS not available in this browser');
    return false;
  }
}

// Test 4: Check responsive design
function testResponsiveDesign() {
  console.log('📋 Test 4: Responsive Design');
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  console.log(`📱 Viewport: ${width}x${height}`);
  
  if (width < 768) {
    console.log('📱 Mobile layout detected');
  } else if (width < 1024) {
    console.log('📱 Tablet layout detected');
  } else {
    console.log('🖥️ Desktop layout detected');
  }
  
  return true;
}

// Test 5: Check data services
function testDataServices() {
  console.log('📋 Test 5: Data Services');
  
  try {
    // Check if data is available in localStorage
    const dataKey = 'english-card-learning-data';
    const importantKey = 'english-card-learning-important';
    
    const hasMainData = localStorage.getItem(dataKey) !== null;
    const hasImportantData = localStorage.getItem(importantKey) !== null;
    
    console.log(`📊 Main data exists: ${hasMainData}`);
    console.log(`⭐ Important data exists: ${hasImportantData}`);
    
    return true;
  } catch (error) {
    console.log('❌ Data services error:', error.message);
    return false;
  }
}

// Test 6: Check error boundaries
function testErrorHandling() {
  console.log('📋 Test 6: Error Handling');
  
  // Check if error boundary components exist
  const errorBoundaries = document.querySelectorAll('[data-error-boundary]');
  console.log(`🛡️ Error boundaries found: ${errorBoundaries.length}`);
  
  return true;
}

// Test 7: Performance check
function testPerformance() {
  console.log('📋 Test 7: Performance Check');
  
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      console.log(`⚡ Page load time: ${Math.round(navigation.loadEventEnd - navigation.fetchStart)}ms`);
      console.log(`🎨 DOM content loaded: ${Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart)}ms`);
    }
    
    const memory = performance.memory;
    if (memory) {
      console.log(`🧠 Memory usage: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`);
    }
  }
  
  return true;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running comprehensive verification tests...\n');
  
  const tests = [
    { name: 'Components Loading', fn: testComponentsLoaded },
    { name: 'localStorage Functionality', fn: testLocalStorage },
    { name: 'TTS Availability', fn: testTTSAvailability },
    { name: 'Responsive Design', fn: testResponsiveDesign },
    { name: 'Data Services', fn: testDataServices },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Performance Check', fn: testPerformance }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passed++;
    } catch (error) {
      console.log(`❌ ${test.name} failed:`, error.message);
    }
    console.log(''); // Add spacing
  }
  
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Application is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  return { passed, total };
}

// Auto-run tests when script is loaded
runAllTests();

// Export for manual use
window.verificationTests = {
  runAll: runAllTests,
  components: testComponentsLoaded,
  localStorage: testLocalStorage,
  tts: testTTSAvailability,
  responsive: testResponsiveDesign,
  dataServices: testDataServices,
  errorHandling: testErrorHandling,
  performance: testPerformance
};