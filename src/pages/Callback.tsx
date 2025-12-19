import axios from "axios";
import React, { ReactNode } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

interface CallbackProps {}

interface CallbackState {
  code: string;
  error: string;
  initializing: boolean;
  appKeys: string;
  copied: boolean;
  appLink: string;
}

export class Callback extends React.Component<CallbackProps, CallbackState> {
  constructor(props: CallbackProps) {
    super(props);

    this.state = {
      code: "",
      error: "",
      initializing: true,
      appKeys: "",
      copied: false,
      appLink: "",
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    this.requestAppKeys(code);
  }

  componentDidUpdate() {
    if (this.state.copied) {
      setTimeout(() => {
        this.setState({
          copied: false,
        });
      }, 1000);
    }
  }

  async requestAppKeys(code: string | null) {
    try {
      if (!code) {
        throw new Error(`GET param "code" is missing.`);
      }

      const resp = await axios.post(
        `https://api.github.com/app-manifests/${code}/conversions`
      );

      if (resp.status > 200 && resp.status < 300) {
        this.setState({ appKeys: JSON.stringify(resp.data, null, 2) });

        if (resp.data.html_url) {
          this.setState({ appLink: resp.data.html_url });
        }
      } else {
        throw new Error(
          `Unexpected response status: ${resp.status} (${resp.statusText}, ${resp.data})`
        );
      }
    } catch (error: any) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ initializing: false });
    }
  }

  onCopy = () => {
    navigator.clipboard.writeText(this.state.appKeys);

    this.setState({
      copied: true,
    });
  };

  render(): ReactNode {
    return (
      <Container className="p-3">
        <Stack direction="vertical" gap={2}>
          <Stack direction="horizontal" gap={2}>
            <Button variant="secondary" href={process.env.PUBLIC_URL}>
              Back to start
            </Button>
          </Stack>
          {this.state.initializing && (
            <Alert key="primary" variant="primary">
              Loading...
            </Alert>
          )}
          {this.state.error && (
            <Alert key="danger" variant="danger">
              {this.state.error}
            </Alert>
          )}
          {this.state.appKeys && (
            <Stack direction="vertical" gap={2}>
              <Stack direction="horizontal" gap={2}>
                <Button
                  onClick={this.onCopy}
                  variant={this.state.copied ? "success" : "secondary"}
                >
                  {this.state.copied ? "Copied" : "Copy"}
                </Button>
                {this.state.appLink && (
                  <Button
                    variant="success"
                    href={this.state.appLink}
                    target="_blank"
                  >
                    Install app
                  </Button>
                )}
              </Stack>

              <Alert
                key="success"
                variant="success"
                style={{ fontSize: "18px" }}
              >
                {this.state.appKeys}
              </Alert>
            </Stack>
          )}
        </Stack>
      </Container>
    );
  }
}
