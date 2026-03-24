import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Navigate to root to clear any broken navigation state
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background px-6 text-center gap-6 z-50">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Qualcosa è andato storto</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Si è verificato un errore imprevisto. Torna alla home per riprendere.
          </p>
          {this.state.error?.message && (
            <p className="text-xs font-mono text-muted-foreground/60 mt-2 bg-muted rounded-lg px-3 py-2">
              {this.state.error.message}
            </p>
          )}
        </div>
        <Button onClick={this.handleReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Torna alla home
        </Button>
      </div>
    );
  }
}