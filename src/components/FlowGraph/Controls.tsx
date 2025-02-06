
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ControlsProps {
  selectedNode: string | null;
  onColorChange: (color: string) => void;
  onFontSizeChange: (size: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  currentColor: string;
  currentFontSize: number;
}

export const Controls = ({
  selectedNode,
  onColorChange,
  onFontSizeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  currentColor,
  currentFontSize,
}: ControlsProps) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
    toast("Color updated");
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    if (size >= 12 && size <= 24) {
      onFontSizeChange(size);
      toast("Font size updated");
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border w-64 space-y-4">
      <div className="space-y-2">
        <Label>Node Color</Label>
        <Input
          type="color"
          value={currentColor}
          onChange={handleColorChange}
          disabled={!selectedNode}
          className="h-10 w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Font Size ({currentFontSize}px)</Label>
        <Input
          type="range"
          min="12"
          max="24"
          value={currentFontSize}
          onChange={handleFontSizeChange}
          disabled={!selectedNode}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1"
        >
          Undo
        </Button>
        <Button
          variant="outline"
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-1"
        >
          Redo
        </Button>
      </div>
    </div>
  );
};
