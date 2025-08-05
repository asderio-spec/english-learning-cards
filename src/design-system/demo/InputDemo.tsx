import React, { useState } from 'react';
import { Input } from '../components/Input';

const InputDemo: React.FC = () => {
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '32px', fontSize: '32px', fontWeight: 700 }}>
        Input Component Demo
      </h1>

      {/* Basic Input Types */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
          Input Types
        </h2>
        
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Input
            type="text"
            label="Text Input"
            placeholder="Enter some text"
            helperText="This is a standard text input"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          
          <Input
            type="email"
            label="Email Input"
            placeholder="Enter your email"
            helperText="We'll never share your email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
          
          <Input
            type="password"
            label="Password Input"
            placeholder="Enter your password"
            helperText="Password must be at least 8 characters"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
          
          <Input
            type="search"
            label="Search Input"
            placeholder="Search..."
            helperText="Search through our content"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>
      </section>

      {/* Input Sizes */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
          Input Sizes
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            size="sm"
            label="Small Input"
            placeholder="Small size input"
            helperText="This is a small input field"
          />
          
          <Input
            size="md"
            label="Medium Input (Default)"
            placeholder="Medium size input"
            helperText="This is a medium input field"
          />
          
          <Input
            size="lg"
            label="Large Input"
            placeholder="Large size input"
            helperText="This is a large input field"
          />
        </div>
      </section>

      {/* Input States */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
          Input States
        </h2>
        
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Input
            label="Normal State"
            placeholder="Normal input"
            helperText="This is a normal input field"
          />
          
          <Input
            label="Error State"
            placeholder="Input with error"
            error
            errorMessage="This field is required"
          />
          
          <Input
            label="Disabled State"
            placeholder="Disabled input"
            disabled
            helperText="This input is disabled"
            value="Cannot edit this"
          />
          
          <Input
            label="With Icons"
            placeholder="Input with icons"
            helperText="Input with left and right icons"
            leftIcon={<span>👤</span>}
            rightIcon={<span>✉️</span>}
          />
        </div>
      </section>

      {/* Full Width Examples */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
          Layout Options
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Auto Width Input"
            placeholder="Auto width"
            helperText="This input has automatic width"
          />
          
          <Input
            label="Full Width Input"
            placeholder="Full width"
            helperText="This input takes full width"
            fullWidth
          />
        </div>
      </section>

      {/* Advanced Examples */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
          Advanced Examples
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Input
            type="tel"
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            helperText="Enter your phone number with country code"
            leftIcon={<span>📞</span>}
          />
          
          <Input
            type="url"
            label="Website URL"
            placeholder="https://example.com"
            helperText="Enter a valid website URL"
            leftIcon={<span>🌐</span>}
          />
          
          <Input
            type="number"
            label="Age"
            placeholder="25"
            helperText="Enter your age in years"
            min="0"
            max="120"
          />
          
          <Input
            label="Custom Styled Input"
            placeholder="Custom styling"
            helperText="This input has custom classes applied"
            className="custom-input"
            containerClassName="custom-container"
            labelClassName="custom-label"
            helperClassName="custom-helper"
          />
        </div>
      </section>

      {/* Interactive Examples */}
      <section>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
          Interactive Examples
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Character Counter"
            placeholder="Type something..."
            helperText={`Characters typed: ${textValue.length}`}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            maxLength={50}
          />
          
          <Input
            label="Email Validation"
            type="email"
            placeholder="Enter your email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            error={emailValue.length > 0 && !emailValue.includes('@')}
            errorMessage={emailValue.length > 0 && !emailValue.includes('@') ? 'Please enter a valid email address' : undefined}
            helperText={emailValue.length === 0 ? 'Enter a valid email address' : undefined}
          />
        </div>
      </section>
    </div>
  );
};

export default InputDemo;