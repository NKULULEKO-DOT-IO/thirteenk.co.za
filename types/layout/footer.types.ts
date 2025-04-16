export interface FooterLink {
  /**
   * The text to display for the link
   */
  label: string;

  /**
   * The URL the link points to
   */
  href: string;

  /**
   * Whether the link should open in a new tab
   */
  isExternal?: boolean;
}

export interface FooterSection {
  /**
   * Title of the footer section
   */
  title: string;

  /**
   * Links to display in this section
   */
  links: FooterLink[];
}

export interface FooterProps {
  /**
   * Optional custom CSS class for the footer container
   */
  className?: string;

  /**
   * Optional content to display in the copyright section
   * If not provided, current year will be used
   */
  copyrightText?: string;

  /**
   * Optional flag to show/hide business plan link
   */
  showBusinessPlanLink?: boolean;

  /**
   * Optional array of footer sections to display
   * If not provided, default footer will be displayed
   */
  sections?: FooterSection[];

  /**
   * Optional additional content to render in the footer
   */
  children?: React.ReactNode;
}