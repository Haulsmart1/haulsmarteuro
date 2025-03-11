import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";

export default function PostLoadDialog({ open, setOpen, newLoad, setNewLoad, handleSaveLoad, editingLoad }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingLoad ? "Edit Load" : "Post a New Load"}</DialogTitle>
        </DialogHeader>
        
        <Input
          placeholder="Origin"
          className="mb-2"
          value={newLoad.origin}
          onChange={(e) => setNewLoad({ ...newLoad, origin: e.target.value })}
        />
        
        <Input
          placeholder="Destination"
          className="mb-2"
          value={newLoad.destination}
          onChange={(e) => setNewLoad({ ...newLoad, destination: e.target.value })}
        />
        
        <Input
          placeholder="Price"
          className="mb-2"
          value={newLoad.price}
          onChange={(e) => setNewLoad({ ...newLoad, price: e.target.value })}
        />

        <Select
          className="mb-2"
          value={newLoad.status}
          onChange={(e) => setNewLoad({ ...newLoad, status: e.target.value })}
        >
          <SelectItem value="Available">Available</SelectItem>
          <SelectItem value="Booked">Booked</SelectItem>
          <SelectItem value="In Transit">In Transit</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </Select>

        <Button className="w-full" onClick={handleSaveLoad}>
          {editingLoad ? "Update Load" : "Post Load"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

