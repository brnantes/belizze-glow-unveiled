import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Code, Save, Info } from "lucide-react";

export const TrackingPixelsManager = () => {
  const [saving, setSaving] = useState(false);
  
  // Google Analytics
  const [googlePixelCode, setGooglePixelCode] = useState("");
  const [googlePixelActive, setGooglePixelActive] = useState(false);
  
  // Facebook Pixel
  const [facebookPixelCode, setFacebookPixelCode] = useState("");
  const [facebookPixelActive, setFacebookPixelActive] = useState(false);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const googleData = localStorage.getItem('belizze_google_pixel');
    if (googleData) {
      try {
        const data = JSON.parse(googleData);
        setGooglePixelCode(data.code || "");
        setGooglePixelActive(data.active || false);
      } catch (e) {
        console.error("Erro ao carregar dados do Google Pixel:", e);
      }
    }

    const facebookData = localStorage.getItem('belizze_facebook_pixel');
    if (facebookData) {
      try {
        const data = JSON.parse(facebookData);
        setFacebookPixelCode(data.code || "");
        setFacebookPixelActive(data.active || false);
      } catch (e) {
        console.error("Erro ao carregar dados do Facebook Pixel:", e);
      }
    }
  }, []);

  // Salvar Google Pixel
  const handleSaveGooglePixel = () => {
    try {
      setSaving(true);
      localStorage.setItem('belizze_google_pixel', JSON.stringify({
        code: googlePixelCode,
        active: googlePixelActive
      }));
      toast.success("Configurações do Google Analytics salvas com sucesso!");
    } catch (e) {
      console.error("Erro ao salvar Google Pixel:", e);
      toast.error("Erro ao salvar configurações do Google Analytics");
    } finally {
      setSaving(false);
    }
  };

  // Salvar Facebook Pixel
  const handleSaveFacebookPixel = () => {
    try {
      setSaving(true);
      localStorage.setItem('belizze_facebook_pixel', JSON.stringify({
        code: facebookPixelCode,
        active: facebookPixelActive
      }));
      toast.success("Configurações do Facebook Pixel salvas com sucesso!");
    } catch (e) {
      console.error("Erro ao salvar Facebook Pixel:", e);
      toast.error("Erro ao salvar configurações do Facebook Pixel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Pixels de Rastreamento</h2>
          <p className="text-muted-foreground">
            Configure os códigos de rastreamento do Google Analytics e Facebook Pixel
          </p>
        </div>
      </div>

      <Tabs defaultValue="google" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="google">Google Analytics</TabsTrigger>
          <TabsTrigger value="facebook">Facebook Pixel</TabsTrigger>
        </TabsList>
        
        {/* Google Analytics */}
        <TabsContent value="google">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    Google Analytics / Google Tag Manager
                  </CardTitle>
                  <CardDescription>
                    Configure o código de rastreamento do Google Analytics ou Google Tag Manager
                  </CardDescription>
                </div>
                <Switch 
                  checked={googlePixelActive}
                  onCheckedChange={setGooglePixelActive}
                  aria-label="Ativar Google Analytics"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="google-pixel-code">Código do Google Analytics</Label>
                  <Textarea
                    id="google-pixel-code"
                    placeholder="Cole o código do Google Analytics aqui..."
                    className="font-mono text-sm h-64"
                    value={googlePixelCode}
                    onChange={(e) => setGooglePixelCode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Cole o código completo do Google Analytics ou Google Tag Manager, incluindo as tags &lt;script&gt;
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800">
                      O código será inserido no &lt;head&gt; do site. Se estiver usando o Google Tag Manager, 
                      certifique-se de incluir apenas o código de inicialização.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleSaveGooglePixel} 
                  disabled={saving}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Facebook Pixel */}
        <TabsContent value="facebook">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    Facebook Pixel
                  </CardTitle>
                  <CardDescription>
                    Configure o código do Facebook Pixel para rastreamento de conversões
                  </CardDescription>
                </div>
                <Switch 
                  checked={facebookPixelActive}
                  onCheckedChange={setFacebookPixelActive}
                  aria-label="Ativar Facebook Pixel"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="facebook-pixel-code">Código do Facebook Pixel</Label>
                  <Textarea
                    id="facebook-pixel-code"
                    placeholder="Cole o código do Facebook Pixel aqui..."
                    className="font-mono text-sm h-64"
                    value={facebookPixelCode}
                    onChange={(e) => setFacebookPixelCode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Cole o código completo do Facebook Pixel, incluindo as tags &lt;script&gt;
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800">
                      O código será inserido no &lt;head&gt; do site. Para eventos de conversão específicos,
                      use a aba "Código Personalizado" para adicionar os eventos em locais específicos.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleSaveFacebookPixel} 
                  disabled={saving}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
};
