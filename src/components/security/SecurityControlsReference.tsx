
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Search, Shield, ClipboardCheck, Users, Home, Server } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface SecurityControl {
  id: string;
  section: string;
  category: string;
  title: string;
  description: string;
}

// ISO 27001:2022 security controls
const securityControls: SecurityControl[] = [
  // Organizational controls
  { id: '5.1', section: '5', category: 'Organizational', title: 'Policies for information security', description: 'Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.' },
  { id: '5.2', section: '5', category: 'Organizational', title: 'Information security roles and responsibilities', description: 'Information security roles and responsibilities shall be defined and allocated according to the organization needs.' },
  { id: '5.3', section: '5', category: 'Organizational', title: 'Segregation of duties', description: 'Conflicting duties and conflicting areas of responsibility shall be segregated.' },
  { id: '5.4', section: '5', category: 'Organizational', title: 'Management responsibilities', description: 'Management shall require all personnel to apply information security in accordance with the established information security policy, topic-specific policies and procedures of the organization.' },
  { id: '5.5', section: '5', category: 'Organizational', title: 'Contact with authorities', description: 'The organization shall establish and maintain contact with relevant authorities.' },
  { id: '5.6', section: '5', category: 'Organizational', title: 'Contact with special interest groups', description: 'The organization shall establish and maintain contact with special interest groups or other specialist security forums and professional associations.' },
  { id: '5.7', section: '5', category: 'Organizational', title: 'Threat intelligence', description: 'Information relating to information security threats shall be collected and analysed to produce threat intelligence.' },
  { id: '5.8', section: '5', category: 'Organizational', title: 'Information security in project management', description: 'Information security shall be integrated into project management.' },
  { id: '5.9', section: '5', category: 'Organizational', title: 'Inventory of information and other associated assets', description: 'An inventory of information and other associated assets, including owners, shall be developed and maintained.' },
  { id: '5.10', section: '5', category: 'Organizational', title: 'Acceptable use of information and other associated assets', description: 'Rules for the acceptable use and procedures for handling information and other associated assets shall be identified, documented and implemented.' },
  { id: '5.11', section: '5', category: 'Organizational', title: 'Return of assets', description: 'Personnel and other interested parties as appropriate shall return all the organization\'s assets in their possession upon change or termination of their employment, contract or agreement.' },
  
  // Add more organizational controls
  { id: '5.12', section: '5', category: 'Organizational', title: 'Classification of information', description: 'Information shall be classified according to the information security needs of the organization based on confidentiality, integrity, availability and relevant interested party requirements.' },
  
  // People controls
  { id: '6.1', section: '6', category: 'People', title: 'Screening', description: 'Background verification checks on all candidates to become personnel shall be carried out prior to joining the organization and on an ongoing basis taking into consideration applicable laws, regulations and ethics and be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.' },
  { id: '6.2', section: '6', category: 'People', title: 'Terms and conditions of employment', description: 'The employment contractual agreements shall state the personnel\'s and the organization\'s responsibilities for information security.' },
  { id: '6.3', section: '6', category: 'People', title: 'Information security awareness, education and training', description: 'Personnel of the organization and relevant interested parties shall receive appropriate information security awareness, education and training and regular updates of the organization\'s information security policy, topic-specific policies and procedures, as relevant for their job function.' },
  
  // Physical controls
  { id: '7.1', section: '7', category: 'Physical', title: 'Physical security perimeters', description: 'Security perimeters shall be defined and used to protect areas that contain information and other associated assets.' },
  { id: '7.2', section: '7', category: 'Physical', title: 'Physical entry', description: 'Secure areas shall be protected by appropriate entry controls and access points.' },
  { id: '7.3', section: '7', category: 'Physical', title: 'Securing offices, rooms and facilities', description: 'Physical security for offices, rooms and facilities shall be designed and implemented.' },
  
  // Technological controls
  { id: '8.1', section: '8', category: 'Technological', title: 'User end point devices', description: 'Information stored on, processed by or accessible via user end point devices shall be protected.' },
  { id: '8.2', section: '8', category: 'Technological', title: 'Privileged access rights', description: 'The allocation and use of privileged access rights shall be restricted and managed.' },
  { id: '8.3', section: '8', category: 'Technological', title: 'Information access restriction', description: 'Access to information and other associated assets shall be restricted in accordance with the established topic-specific policy on access control.' },
  { id: '8.4', section: '8', category: 'Technological', title: 'Access to source code', description: 'Read and write access to source code, development tools and software libraries shall be appropriately managed.' },
  { id: '8.5', section: '8', category: 'Technological', title: 'Secure authentication', description: 'Secure authentication technologies and procedures shall be implemented based on information access restrictions and the topic-specific policy on access control.' },
  { id: '8.24', section: '8', category: 'Technological', title: 'Use of cryptography', description: 'Rules for the effective use of cryptography, including cryptographic key management, shall be defined and implemented.' },
  { id: '8.25', section: '8', category: 'Technological', title: 'Secure development life cycle', description: 'Rules for the secure development of software and systems shall be established and applied.' },
];

export const SecurityControlsReference: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredControls = useMemo(() => {
    return securityControls.filter(control => {
      const matchesSearch = 
        control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.id.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = 
        activeTab === 'all' || 
        control.category.toLowerCase() === activeTab.toLowerCase();
        
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeTab]);

  // Get count of controls by category
  const controlCounts = useMemo(() => {
    const counts = {
      all: securityControls.length,
      Organizational: 0,
      People: 0,
      Physical: 0,
      Technological: 0
    };
    
    securityControls.forEach(control => {
      counts[control.category as keyof typeof counts] += 1;
    });
    
    return counts;
  }, []);

  // Map category to icon
  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'organizational':
        return <ClipboardCheck className="h-4 w-4" />;
      case 'people':
        return <Users className="h-4 w-4" />;
      case 'physical':
        return <Home className="h-4 w-4" />;
      case 'technological':
        return <Server className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Security Controls Reference</h2>
        <p className="text-muted-foreground">
          Browse the security controls specified in ISO/IEC 27001:2022 Annex A.
        </p>
        
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search controls by ID, title or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border focus-ring"
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto p-0 flex">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Shield className="mr-2 h-4 w-4" />
            All Controls
            <Badge variant="outline" className="ml-2 bg-primary/5">{controlCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Organizational" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Organizational
            <Badge variant="outline" className="ml-2 bg-primary/5">{controlCounts.Organizational}</Badge>
          </TabsTrigger>
          <TabsTrigger value="People" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Users className="mr-2 h-4 w-4" />
            People
            <Badge variant="outline" className="ml-2 bg-primary/5">{controlCounts.People}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Physical" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Home className="mr-2 h-4 w-4" />
            Physical
            <Badge variant="outline" className="ml-2 bg-primary/5">{controlCounts.Physical}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Technological" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Server className="mr-2 h-4 w-4" />
            Technological
            <Badge variant="outline" className="ml-2 bg-primary/5">{controlCounts.Technological}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="rounded-md border shadow-sm overflow-hidden bg-card">
            <Table>
              <TableCaption>
                ISO/IEC 27001:2022 Information Security Controls
              </TableCaption>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead className="w-[250px]">Control</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredControls.map((control) => (
                  <TableRow key={control.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-mono font-medium">{control.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(control.category)}
                        <span>{control.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{control.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{control.description}</TableCell>
                  </TableRow>
                ))}
                {filteredControls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-8 w-8 mb-2 opacity-40" />
                        <p>No controls found matching your search criteria.</p>
                        <p className="text-sm">Try adjusting your search terms or category filter.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
