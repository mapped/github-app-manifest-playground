import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import React from "react";
import { Alert, Badge } from "react-bootstrap";

interface StartProps {}

interface StartState {
  url: string;
  manifestRaw: string;
  manifestError: string;
  manifest: string;
  copied: boolean;
  displayRedirectHint: boolean;
  redirectUrl: string;
  uriFromUrl: string;
  manifestRawFromUrl: string;
}

export class Start extends React.Component<StartProps, StartState> {
  constructor(props: StartProps) {
    super(props);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uriFromUrl = urlParams.get("url");
    const manifestRawFromUrl = urlParams.get("manifestRaw");

    window.history.pushState("", "", process.env.PUBLIC_URL);
    const redirectUrl = `${window.location.href}`;

    let defaultManifestRaw = JSON.stringify(
      JSON.parse(`{
      "name": "Octoapp",
      "url": "https://www.example.com",
      "hook_attributes": {
        "url": "https://example.com/github/events"
      },
      "redirect_url": "${redirectUrl}",
      "callback_urls": [
        "https://example.com/callback"
      ],
      "public": true,
      "default_permissions": {
        "issues": "write",
        "checks": "write"
      },
      "default_events": [
        "issues",
        "issue_comment",
        "check_suite",
        "check_run"
      ]
    }`),
      null,
      2
    );

    let defaultUrl =
      "https://github.com/organizations/ORGANIZATION/settings/apps/new?state=abc123";

    const urlFromStorage = localStorage.getItem("url");
    const manifestRawFromStorage = localStorage.getItem("manifestRaw");

    if (urlFromStorage) {
      defaultUrl = urlFromStorage;
    }

    if (manifestRawFromStorage) {
      defaultManifestRaw = manifestRawFromStorage;
    }

    let importedFromUrl = false;

    if (uriFromUrl) {
      defaultUrl = uriFromUrl;
      importedFromUrl = true;
    }

    if (manifestRawFromUrl) {
      defaultManifestRaw = manifestRawFromUrl;
      importedFromUrl = true;
    }

    this.state = {
      url: defaultUrl,
      manifestRaw: defaultManifestRaw,
      manifestError: "",
      manifest: "",
      copied: false,
      displayRedirectHint: false,
      redirectUrl: redirectUrl,
      uriFromUrl: uriFromUrl ?? "",
      manifestRawFromUrl: manifestRawFromUrl ?? "",
    };
  }

  componentDidMount() {
    this.onUrlChange({ target: { value: this.state.url } } as any);
    this.onManifestChange({ target: { value: this.state.manifestRaw } } as any);
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

  onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    this.setState({ url: url });
    localStorage.setItem("url", url);
  };

  onManifestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const manifestRaw = event.target.value;
    localStorage.setItem("manifestRaw", manifestRaw);
    this.setState({ manifestRaw: manifestRaw });
    this.validateManifest(manifestRaw);
  };

  validateManifest(manifestRaw: string) {
    try {
      const manifestJson = JSON.parse(manifestRaw);
      const manifest = JSON.stringify(manifestJson);
      this.setState({
        manifest: manifest,
        manifestError: "",
      });

      this.setState({
        displayRedirectHint:
          manifestJson.redirect_url !== this.state.redirectUrl,
      });
    } catch (error: any) {
      this.setState({
        manifestError: `Invalid JSON: ${error}`,
      });
    }
  }

  onSetRedirectUrl = () => {
    const manifestJson = JSON.parse(this.state.manifestRaw);
    manifestJson.redirect_url = this.state.redirectUrl;

    this.onManifestChange({
      target: {
        value: JSON.stringify(manifestJson, null, 2),
      },
    } as any);
  };

  onCopy = () => {
    const text = `${window.location.href}?url=${encodeURIComponent(
      this.state.url
    )}&manifestRaw=${encodeURIComponent(this.state.manifestRaw)}`;

    navigator.clipboard.writeText(text);

    this.setState({
      copied: true,
    });
  };

  render() {
    return (
      <Container className="p-3">
        <Form method="post" action={this.state.url}>
          <Form.Group className="mb-3" controlId="url">
            <Form.Label>
              URL{" "}
              {this.state.uriFromUrl &&
                this.state.uriFromUrl === this.state.url && (
                  <Badge bg="success">Imported from URL</Badge>
                )}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="URL"
              onChange={this.onUrlChange}
              value={this.state.url}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="manifest">
            <Form.Label>
              Manifest{" "}
              {this.state.manifestRawFromUrl &&
                this.state.manifestRawFromUrl === this.state.manifestRaw && (
                  <Badge bg="success">Imported from URL</Badge>
                )}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={15}
              placeholder="Manifest"
              onChange={this.onManifestChange}
              value={this.state.manifestRaw}
              isInvalid={!!this.state.manifestError}
            />
            <Form.Control.Feedback type="invalid">
              {this.state.manifestError}
            </Form.Control.Feedback>
            <Form.Control
              type="hidden"
              name="manifest"
              value={this.state.manifest}
            />
          </Form.Group>
          <Stack direction="vertical" gap={2}>
            {this.state.displayRedirectHint && (
              <Alert variant="secondary">
                Set redirect_url to <b>{this.state.redirectUrl}</b> to get App
                keys on this site.{" "}
                <Button variant="primary" onClick={this.onSetRedirectUrl}>
                  Set
                </Button>
              </Alert>
            )}
            <Stack direction="horizontal" gap={2}>
              <Button
                variant="primary"
                type="submit"
                disabled={!!this.state.manifestError}
              >
                Start
              </Button>
              <Button
                onClick={this.onCopy}
                variant={this.state.copied ? "success" : "secondary"}
                disabled={!!this.state.manifestError}
              >
                {this.state.copied ? "Copied" : "Copy link"}
              </Button>
            </Stack>
          </Stack>
        </Form>
      </Container>
    );
  }
}
