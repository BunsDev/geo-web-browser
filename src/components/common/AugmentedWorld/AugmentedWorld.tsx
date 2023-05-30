import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./styles.module.css";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import init, {
  World,
  ComponentType,
  GLTFModel,
  Position,
  Orientation,
  IsAnchor,
  Anchor,
  TrackedImage,
  CoachingOverlay,
  Scale,
  System,
} from "augmented-worlds";
import {
  GraphicsSystem,
  WebXRSystem,
  AnchorSystem,
  AnchorTransformSystem,
  ImageTrackingSystem,
  CoachingOverlaySystem,
} from "@augmented-worlds/system-babylonjs";
import GWLoader from "../Loader/Loader";
import CopyTooltip from "../CopyTooltip";
import Image from "react-bootstrap/Image";
import { UAParser } from "ua-parser-js";

const useStyles = makeStyles(() => ({
  btn: {
    alignSelf: "flex-end",
    marginRight: "20px",
    backgroundColor: "#2fc1c1",
    color: "white",
    marginTop: "50px",
  },
}));

enum State {
  Loading,
  Ready,
  NotSupported,
}

function EnterView({
  incubationsUri,
  enterWorld,
}: {
  incubationsUri: string;
  enterWorld: () => Promise<void>;
}) {
  const classes = useStyles();
  const copyUri = useCallback(() => {
    navigator.clipboard.writeText(incubationsUri);
  }, [incubationsUri]);

  return (
    <span className={styles["ar-txt"]}>
      <div className={styles["ar-icon"]} />
      <h1>Enter Augmented Reality</h1>
      <p>
        This AR experience relies on certain device permissions and
        dependencies. If you haven’t already:
      </p>
      <ul>
        <li>
          Paste the following into your URL bar & enable the WebXR Incubations
          flag:{" "}
          <span style={{ textDecoration: "underline" }}>{incubationsUri}</span>{" "}
          <CopyTooltip
            contentClick="Copied"
            contentHover="Copy Address"
            target={
              <div className="d-flex flex-shrink-1 align-items-center">
                <Image width={25} src="/assets/copy-light.svg" alt="copy" />
              </div>
            }
            handleCopy={copyUri}
          />
        </li>
        <li>
          Install the{" "}
          <a href="https://play.google.com/store/apps/details?id=com.google.ar.core">
            latest version of ARCore
          </a>
        </li>
      </ul>
      <Button
        className={classes.btn}
        onClick={enterWorld}
        style={{ marginTop: "20px" }}
      >
        Start AR Session
      </Button>
    </span>
  );
}

function NotAvailableView({ incubationsUri }: { incubationsUri: string }) {
  const parser = new UAParser();
  const { os } = parser.getResult();

  const copyUri = useCallback(() => {
    navigator.clipboard.writeText(incubationsUri);
  }, [incubationsUri]);

  return (
    <span className={styles["ar-txt"]}>
      <div className={styles["ar-unavailable-icon"]} />
      <h1>Browser Not Compatible</h1>
      {os.name === "iOS" ? (
        <p>iOS doesn’t yet support WebXR.</p>
      ) : os.name === "Android" ? (
        <p>
          On Android, try using{" "}
          <a href="https://play.google.com/store/apps/details?id=com.android.chrome">
            Chrome (version 113+)
          </a>{" "}
          & installing the{" "}
          <a href="https://play.google.com/store/apps/details?id=com.google.ar.core">
            latest version of ARCore
          </a>
          . Then paste the following into your URL bar & enable the WebXR
          Incubations flag:{" "}
          <span style={{ textDecoration: "underline" }}>{incubationsUri}</span>{" "}
          <CopyTooltip
            contentClick="Copied"
            contentHover="Copy Address"
            target={
              <div className="d-flex flex-shrink-1 align-items-center">
                <Image width={25} src="/assets/copy-light.svg" alt="copy" />
              </div>
            }
            handleCopy={copyUri}
          />
        </p>
      ) : (
        <p>
          This augmented reality experience uses experimental features of the
          open-source WebXR standard. Not all devices and browsers support these
          features.
        </p>
      )}
    </span>
  );
}

export default function AugmentedWorld() {
  const [state, setState] = useState(State.Ready);
  const [world, setWorld] = useState<World | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const parser = new UAParser();
  const { browser } = parser.getResult();

  const incubationsUri = `${
    browser.name === "Brave"
      ? "brave"
      : browser.name === "Samsung Browser"
      ? "internet"
      : "chrome"
  }://flags/#webxr-incubations`;

  // Setup World
  useEffect(() => {
    (async () => {
      const isSupported = await WebXRSystem.isSupported();

      if (isSupported) {
        setState(State.Ready);
      } else {
        setState(State.NotSupported);
      }

      await init();

      // Create World
      setWorld(new World());
    })();
  }, []);

  const enterWorld = useCallback(async () => {
    if (!world || !canvasRef.current || !overlayRef.current) return;

    // setState(State.Loading);

    //     const testImageAnchor = world.create_entity();
    //     world.add_component_to_entity(testImageAnchor, ComponentType.Component, {});
    //     world.add_component_to_entity(
    //       testImageAnchor,
    //       ComponentType.Position,
    //       {} as Position
    //     );
    //     world.add_component_to_entity(
    //       testImageAnchor,
    //       ComponentType.Orientation,
    //       {} as Orientation
    //     );
    //     world.add_component_to_entity(testImageAnchor, ComponentType.TrackedImage, {
    //       imageAsset: {
    //         "/": "QmZsDopGXAGPtToWSi8bxYjsrZkiraX7wqMZ9K8LgW2tyE",
    //       },
    //       physicalWidthInMeters: 0.165,
    //     } as TrackedImage);
    //     world.add_component_to_entity(testImageAnchor, ComponentType.IsAnchor, {
    //       isAnchor: true,
    //     } as IsAnchor);
    //
    //     const testEntity = world.create_entity();
    //     world.add_component_to_entity(testEntity, ComponentType.Component, {});
    //     world.add_component_to_entity(testEntity, ComponentType.GLTFModel, {
    //       glTFModel: { "/": "QmdPXtkGThsWvR1YKg4QVSR9n8oHMPmpBEnyyV8Tk638o9" },
    //     } as GLTFModel);
    //     world.add_component_to_entity(testEntity, ComponentType.Position, {
    //       startPosition: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //       },
    //     } as Position);
    //     world.add_component_to_entity(testEntity, ComponentType.Orientation, {
    //       startOrientation: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //         w: 1,
    //       },
    //     } as Orientation);
    //     world.add_component_to_entity(testEntity, ComponentType.Scale, {
    //       startScale: {
    //         x: 1,
    //         y: 1,
    //         z: 1,
    //       },
    //     } as Scale);
    //     world.add_component_to_entity(testEntity, ComponentType.Anchor, {
    //       anchor: testImageAnchor,
    //     } as Anchor);
    //
    //     const coachingOverlayEntity = world.create_entity();
    //     world.add_component_to_entity(
    //       coachingOverlayEntity,
    //       ComponentType.CoachingOverlay,
    //       {
    //         trackedImages: [{ "/": testImageAnchor }],
    //         text: "Point and hold the camera on the image target to enter AR.",
    //       } as CoachingOverlay
    //     );

    // Create host systems
    const graphicsSystem = new GraphicsSystem(
      world,
      canvasRef.current,
      "https://w3s.link"
    );
    const webXRSystem = new WebXRSystem(graphicsSystem.getScene());
    const webXRAnchorSystem = new AnchorSystem(webXRSystem);
    const anchorTransformSystem = new AnchorTransformSystem();
    const imageTrackingSystem = new ImageTrackingSystem(
      webXRSystem,
      "https://w3s.link"
    );
    const coachingOverlaySystem = new CoachingOverlaySystem(
      webXRSystem,
      "https://w3s.link",
      overlayRef.current
    );

    world.add_system(graphicsSystem);
    world.add_system(webXRSystem);
    world.add_system(webXRAnchorSystem);
    world.add_system(anchorTransformSystem);
    world.add_system(imageTrackingSystem);
    world.add_system(coachingOverlaySystem);

    try {
      await webXRSystem.startXRSession();
      graphicsSystem.start();

      canvasRef.current.hidden = false;
      overlayRef.current.hidden = false;
    } catch (e) {
      console.log(e);
      setState(State.NotSupported);
    }
  }, [world, canvasRef, overlayRef]);

  return (
    <div className={styles["wrapper"]}>
      <canvas ref={canvasRef} hidden />
      <div ref={overlayRef} hidden />
      {state === State.Loading ? (
        <GWLoader />
      ) : state === State.Ready ? (
        <EnterView enterWorld={enterWorld} incubationsUri={incubationsUri} />
      ) : (
        <NotAvailableView incubationsUri={incubationsUri} />
      )}
    </div>
  );
}
