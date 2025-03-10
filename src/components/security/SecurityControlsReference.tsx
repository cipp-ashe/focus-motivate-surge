
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Data for ISO/IEC 27001:2022 controls
const securityControls = [
  // 5 Organizational controls
  { section: "5.1", name: "Policies for information security", description: "Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.", category: "Organizational" },
  { section: "5.2", name: "Information security roles and responsibilities", description: "Information security roles and responsibilities shall be defined and allocated according to the organization needs.", category: "Organizational" },
  { section: "5.3", name: "Segregation of duties", description: "Conflicting duties and conflicting areas of responsibility shall be segregated.", category: "Organizational" },
  { section: "5.4", name: "Management responsibilities", description: "Management shall require all personnel to apply information security in accordance with the established information security policy, topic-specific policies and procedures of the organization.", category: "Organizational" },
  { section: "5.5", name: "Contact with authorities", description: "The organization shall establish and maintain contact with relevant authorities.", category: "Organizational" },
  { section: "5.6", name: "Contact with special interest groups", description: "The organization shall establish and maintain contact with special interest groups or other specialist security forums and professional associations.", category: "Organizational" },
  { section: "5.7", name: "Threat intelligence", description: "Information relating to information security threats shall be collected and analysed to produce threat intelligence.", category: "Organizational" },
  { section: "5.8", name: "Information security in project management", description: "Information security shall be integrated into project management.", category: "Organizational" },
  { section: "5.9", name: "Inventory of information and other associated assets", description: "An inventory of information and other associated assets, including owners, shall be developed and maintained.", category: "Organizational" },
  { section: "5.10", name: "Acceptable use of information and other associated assets", description: "Rules for the acceptable use and procedures for handling information and other associated assets shall be identified, documented and implemented.", category: "Organizational" },
  { section: "5.11", name: "Return of assets", description: "Personnel and other interested parties as appropriate shall return all the organization's assets in their possession upon change or termination of their employment, contract or agreement.", category: "Organizational" },
  { section: "5.12", name: "Classification of information", description: "Information shall be classified according to the information security needs of the organization based on confidentiality, integrity, availability and relevant interested party requirements.", category: "Organizational" },
  
  // People controls
  { section: "6.1", name: "Screening", description: "Background verification checks on all candidates to become personnel shall be carried out prior to joining the organization and on an ongoing basis taking into consideration applicable laws, regulations and ethics and be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.", category: "People" },
  { section: "6.2", name: "Terms and conditions of employment", description: "The employment contractual agreements shall state the personnel's and the organization's responsibilities for information security.", category: "People" },
  { section: "6.3", name: "Information security awareness, education and training", description: "Personnel of the organization and relevant interested parties shall receive appropriate information security awareness, education and training and regular updates of the organization's information security policy, topic-specific policies and procedures, as relevant for their job function.", category: "People" },
  { section: "6.4", name: "Disciplinary process", description: "A disciplinary process shall be formalized and communicated to take actions against personnel and other relevant interested parties who have committed an information security policy violation.", category: "People" },
  { section: "6.5", name: "Responsibilities after termination or change of employment", description: "Information security responsibilities and duties that remain valid after termination or change of employment shall be defined, enforced and communicated to relevant personnel and other interested parties.", category: "People" },
  
  // Physical controls
  { section: "7.1", name: "Physical security perimeters", description: "Security perimeters shall be defined and used to protect areas that contain information and other associated assets.", category: "Physical" },
  { section: "7.2", name: "Physical entry", description: "Secure areas shall be protected by appropriate entry controls and access points.", category: "Physical" },
  { section: "7.3", name: "Securing offices, rooms and facilities", description: "Physical security for offices, rooms and facilities shall be designed and implemented.", category: "Physical" },
  
  // Technological controls
  { section: "8.1", name: "User end point devices", description: "Information stored on, processed by or accessible via user end point devices shall be protected.", category: "Technological" },
  { section: "8.2", name: "Privileged access rights", description: "The allocation and use of privileged access rights shall be restricted and managed.", category: "Technological" },
  { section: "8.3", name: "Information access restriction", description: "Access to information and other associated assets shall be restricted in accordance with the established topic-specific policy on access control.", category: "Technological" },
  { section: "8.4", name: "Access to source code", description: "Read and write access to source code, development tools and software libraries shall be appropriately managed.", category: "Technological" },
  { section: "8.5", name: "Secure authentication", description: "Secure authentication technologies and procedures shall be implemented based on information access restrictions and the topic-specific policy on access control.", category: "Technological" },
  { section: "8.6", name: "Capacity management", description: "The use of resources shall be monitored and adjusted in line with current and expected capacity requirements.", category: "Technological" },
  { section: "8.7", name: "Protection against malware", description: "Protection against malware shall be implemented and supported by appropriate user awareness.", category: "Technological" },
  // Add all the security controls here
];

export const SecurityControlsReference: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  
  const filteredControls = securityControls.filter(control => {
    const matchesSearch = searchTerm === "" || 
      control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.section.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = activeTab === "all" || 
      control.category.toLowerCase() === activeTab.toLowerCase();
      
    return matchesSearch && matchesCategory;
  });
  
  return (
    <Card className="shadow-md border-border/20 w-full">
      <CardHeader className="bg-card/70 border-b border-border/10 py-4">
        <CardTitle className="text-lg font-medium">
          ISO/IEC 27001:2022 Security Controls Reference
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-6">
        <div className="flex items-center mb-6 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search security controls..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Controls</TabsTrigger>
            <TabsTrigger value="Organizational">Organizational</TabsTrigger>
            <TabsTrigger value="People">People</TabsTrigger>
            <TabsTrigger value="Physical">Physical</TabsTrigger>
            <TabsTrigger value="Technological">Technological</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Section</TableHead>
                  <TableHead className="w-1/3">Control</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredControls.map((control) => (
                  <TableRow key={control.section}>
                    <TableCell className="font-medium">{control.section}</TableCell>
                    <TableCell>{control.name}</TableCell>
                    <TableCell className="text-sm">{control.description}</TableCell>
                  </TableRow>
                ))}
                {filteredControls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      No security controls found for your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};
