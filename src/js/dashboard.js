import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Tabs, Tab } from "@/components/ui/tabs";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

export default function FreightDashboard() {
  const [loads, setLoads] = useState([
    { id: 1, origin: "New York", destination: "Chicago", price: "$1500", status: "Available" },
    { id: 2, origin: "Los Angeles", destination: "Houston", price: "$2000", status: "Booked" },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLoad, setNewLoad] = useState({ origin: "", destination: "", price: "", status: "Available" });

  // Filter Loads Based on Search
  const filteredLoads = loads.filter((load) =>
    load.origin.toLowerCase().includes(search.toLowerCase()) || 
    load.destination.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Posting a New Load
  const handlePostLoad = () => {
    if (!newLoad.origin || !newLoad.destination || !newLoad.price) {
      alert("Please fill in all fields.");
      return;
    }
    setLoads([...loads, { id: loads.length + 1, ...newLoad }]);
    setIsModalOpen(false);
    setNewLoad({ origin: "", destination: "", price: "", status: "Available" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚛 Freight Exchange Dashboard</h1>
      
      <Tabs>
        {/* Live Loads Tab */}
        <Tab label="Live Loads">
          <Card className="mb-4">
            <CardContent>
              <Input 
                placeholder="Search loads..." 
                className="mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Table>
                <Thead>
                  <Tr>
                    <Th>Origin</Th>
                    <Th>Destination</Th>
                    <Th>Price</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredLoads.map((load) => (
                    <Tr key={load.id}>
                      <Td>{load.origin}</Td>
                      <Td>{load.destination}</Td>
                      <Td>{load.price}</Td>
                      <Td>{load.status}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardContent>
          </Card>
          <Button className="w-full" onClick={() => setIsModalOpen(true)}>Post a Load</Button>
        </Tab>

        {/* Backhauls / Co-Loads */}
        <Tab label="Backhauls / Co-Loads">
          <Card>
            <CardContent>
              <p>Auto-suggested return loads based on completed trips.</p>
            </CardContent>
          </Card>
        </Tab>

        {/* Pricing & Cost Analysis */}
        <Tab label="Pricing & Cost Analysis">
          <Card>
            <CardContent>
              <p>Estimated trip costs, fuel calculations, and minimum rate protection.</p>
            </CardContent>
          </Card>
        </Tab>

        {/* Subscription & Billing */}
        <Tab label="Subscription & Billing">
          <Card>
            <CardContent>
              <p>🚀 Free Trial: <b>60 Days</b></p>
              <p>Upgrade to PRO for unlimited access.</p>
              <Button className="mt-2">Subscribe Now</Button>
            </CardContent>
          </Card>
        </Tab>
      </Tabs>

      {/* Modal for Posting a New Load */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle>Post a New Load</DialogTitle>
          <DialogContent>
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
            <Button className="w-full" onClick={handlePostLoad}>Post Load</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
