# Benny AI Chat Website - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern AI chat interfaces like ChatGPT, Claude, and Perplexity, with emphasis on clean conversation flow and professional utility-focused design.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Dark Mode: Background 222 15% 12%, Surface 222 15% 16%, Text 210 20% 85%
- Light Mode: Background 210 20% 98%, Surface 0 0% 100%, Text 222 15% 15%
- Brand Accent: 217 91% 60% (Modern blue for Benny branding)

### Typography
- **Primary Font**: Inter via Google Fonts for excellent readability in chat interfaces
- **Headings**: Semi-bold (600) for "Benny" branding
- **Body Text**: Regular (400) for chat messages
- **UI Elements**: Medium (500) for buttons and labels

### Layout System
**Tailwind Spacing Units**: Consistent use of 2, 4, 6, and 8 units
- `p-4` for message padding
- `gap-6` for message spacing
- `mx-8` for container margins
- `h-2` for minimal dividers

### Component Library

**Chat Interface:**
- **Message Bubbles**: User messages aligned right with brand accent background, AI responses aligned left with surface background
- **Avatar System**: Simple circular avatars - user initials and "B" for Benny
- **Input Area**: Fixed bottom input with rounded corners, send button integrated
- **Scroll Container**: Messages area with custom scrollbar styling

**Navigation & Branding:**
- **Header**: Clean top bar with "Benny" wordmark, minimal height
- **Typography Hierarchy**: Large title for "Benny", subtitle explaining AI assistant purpose

**Interactive Elements:**
- **Send Button**: Primary blue with subtle hover states
- **Input Field**: Large, accessible text area with placeholder text
- **Loading States**: Subtle typing indicators with animated dots

## Layout Structure

**Single-Page Chat Application:**
1. **Header Section** (10% height): Benny branding and minimal navigation
2. **Chat Container** (80% height): Scrollable message history with message bubbles
3. **Input Section** (10% height): Fixed bottom input area with send functionality

**Responsive Behavior:**
- **Desktop**: Centered chat container with max-width constraint
- **Mobile**: Full-width with optimized touch targets and keyboard handling
- **Consistent**: Dark/light mode toggle maintaining conversation readability

## Key Design Principles
- **Conversation First**: Interface disappears to highlight AI-human dialogue
- **Accessibility**: High contrast ratios, keyboard navigation, screen reader support
- **Performance**: Minimal animations, fast message rendering
- **Professional**: Clean, trustworthy appearance suitable for serious AI assistance

## Images
No hero images or decorative imagery needed. Focus on clean iconography:
- Simple geometric "B" logo for Benny branding
- Minimal send arrow icon for input button
- User avatar placeholders (initials-based)

This creates a focused, professional AI chat experience that prioritizes conversation clarity and user trust.