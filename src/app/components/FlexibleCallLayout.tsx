import useStreamCall from "@/hooks/useStreamCall";
import { CallControls, PaginatedGridLayout, SpeakerLayout } from "@stream-io/video-react-sdk";
import {
  BetweenHorizonalEnd,
  BetweenVerticalEnd,
  LayoutGridIcon,
} from "lucide-react";
import { useState } from "react";
import EndCallButton from "./EndCallButton";

type CallLayout = "vertical" | "horizontal" | "grid";

export default function FlexibleCallLayout() {
  const [layout, setLayout] = useState<CallLayout>("vertical");

  const call = useStreamCall();

  return (
    <div className="space-y-2">
      <CallLayoutButtons layout={layout} setLayout={setLayout} />
      <CallLayoutView layout={layout} />
      <CallControls/>
      <EndCallButton/>
    </div>
  );
}

interface CallLayoutButtonsProps {
  layout: CallLayout;
  setLayout: (layout: CallLayout) => void;
}

function CallLayoutButtons({ layout, setLayout }: CallLayoutButtonsProps) {
  return (
    <div className="mx-auto w-fit space-x-6">
      <button onClick={() => setLayout("vertical")}>
        <BetweenVerticalEnd
          className={layout !== "vertical" ? "text-gray-400" : ""}
        />
      </button>
      <button onClick={() => setLayout("horizontal")}>
        <BetweenHorizonalEnd
          className={layout !== "horizontal" ? "text-gray-400" : ""}
        />
      </button>
      <button onClick={() => setLayout("grid")}>
        <LayoutGridIcon className={layout !== "grid" ? "text-gray-400" : ""} />
      </button>
    </div>
  );
}

interface CallLayoutViewProps {
  layout: CallLayout;
}
function CallLayoutView({ layout }: CallLayoutViewProps) {
  if (layout === "vertical") {
    return <SpeakerLayout />;
  }

  if (layout == "horizontal") {
    return <SpeakerLayout participantsBarPosition="right" />;
  }
  if (layout == "grid") {
    return <PaginatedGridLayout />;
  }

  return null;
}
