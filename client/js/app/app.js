import mobileMenu from './mobile-menu';
import ExternalLink from './external-link';
import SectionLink from './section-link';
import inlineIframes from './inline-iframes';

// Mobile Menu
mobileMenu();

// External Link
const aiExternalLink = new ExternalLink();
aiExternalLink.init();

// Section Link
const aiSectionLink = new SectionLink();
aiSectionLink.init();

// Inline iFrames
inlineIframes();
