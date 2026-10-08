import { Component } from 'react';

// Last line of defence: a render error never leaves a blank page, and no
// technical detail is shown to the visitor.
export class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error(error); // eslint-disable-line no-console
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="container state">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="state__title">We lost the signal.</h1>
        <p className="lede">The page could not be displayed. Please reload — your booking, if you made one, is safe.</p>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          <span>Reload the page</span>
        </button>
      </div>
    );
  }
}
