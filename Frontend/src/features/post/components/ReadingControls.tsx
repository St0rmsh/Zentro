import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setFontSize, setReadingWidth, toggleFocusMode } from "../state/postSlice";
import { Button } from "../../../shared/ui/button";
import { Maximize, Minimize, Type, LayoutTemplate, Focus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../shared/ui/dropdown-menu";
import { motion } from "framer-motion";

export const ReadingControls = () => {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.post);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 md:bottom-8 lg:bottom-12"
    >
      <div className="bg-background/80 backdrop-blur-md border border-border/60 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-muted">
              <Type className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48 p-2">
            <DropdownMenuLabel>Font Size: {settings.fontSize}px</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex justify-between items-center px-2 py-1">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => dispatch(setFontSize(settings.fontSize - 2))}
                disabled={settings.fontSize <= 14}
              >
                <Minimize className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">Aa</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => dispatch(setFontSize(settings.fontSize + 2))}
                disabled={settings.fontSize >= 24}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border/60" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-muted">
              <LayoutTemplate className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-32">
            <DropdownMenuLabel>Width</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => dispatch(setReadingWidth("narrow"))}>
              Narrow {settings.readingWidth === "narrow" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => dispatch(setReadingWidth("medium"))}>
              Medium {settings.readingWidth === "medium" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => dispatch(setReadingWidth("wide"))}>
              Wide {settings.readingWidth === "wide" && "✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border/60" />

        <Button 
          variant={settings.focusMode ? "default" : "ghost"} 
          size="icon" 
          className="rounded-full w-10 h-10"
          onClick={() => dispatch(toggleFocusMode())}
          title="Toggle Focus Mode"
        >
          <Focus className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};
