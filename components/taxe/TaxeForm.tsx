// DIACARE/components/taxe/TaxeForm.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Importations des composants Shadcn UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

// Pour la gestion de formulaire (React Hook Form et Zod)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Pour le composant Form de Shadcn UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Utilitaires
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Download } from 'lucide-react'; // <-- Importer ArrowLeft et Download

// Importations pour la génération de PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Schéma de validation Zod ---
const formSchema = z.object({
  patientName: z.string().min(2, { message: "Le nom du patient est requis." }),
  medicalRecordNumber: z.string().min(1, { message: "Le N° Dossier Médical est requis." }),
  sessionDate: z.date({ required_error: "La date de la séance est requise." }),
  sessionTimeFrom: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Heure de début invalide." }).optional().or(z.literal('')),
  sessionTimeTo: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Heure de fin invalide." }).optional().or(z.literal('')),
  responsibleDoctor: z.string().min(2, { message: "Le nom du médecin est requis." }),
  dialysisFee: z.coerce.number().min(0, { message: "Le montant doit être positif." }),
  generatorDialyzer: z.coerce.number().min(0, { message: "Le montant doit être positif." }),
  medConsumables: z.coerce.number().min(0, { message: "Le montant doit être positif." }),
  nursingCare: z.coerce.number().min(0, { message: "Le montant doit être positif." }),
  adminFees: z.coerce.number().min(0, { message: "Le montant doit être positif." }),
  taxPercentage: z.coerce.number().min(0).max(100, { message: "Le pourcentage de taxe doit être entre 0 et 100." }),
  paymentMethod: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un mode de paiement." }),
  paymentReference: z.string().optional(),
  observations: z.string().optional(),
});

type TaxeFormValues = z.infer<typeof formSchema>;

const TaxeForm = () => {
  const router = useRouter();
  // La référence sera maintenant sur le contenu DU FORMULAIRE SEULEMENT, pas le conteneur des boutons
  const formContentRef = useRef<HTMLDivElement>(null);

  const form = useForm<TaxeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: '',
      medicalRecordNumber: '',
      sessionDate: undefined,
      sessionTimeFrom: '',
      sessionTimeTo: '',
      responsibleDoctor: '',
      dialysisFee: 800,
      generatorDialyzer: 150,
      medConsumables: 100,
      nursingCare: 50,
      adminFees: 20,
      taxPercentage: 0,
      paymentMethod: [],
      paymentReference: '',
      observations: '',
    },
  });

  const [subTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalToPay, setTotalToPay] = useState(0);

  const watchedDialysisFee = form.watch('dialysisFee');
  const watchedGeneratorDialyzer = form.watch('generatorDialyzer');
  const watchedMedConsumables = form.watch('medConsumables');
  const watchedNursingCare = form.watch('nursingCare');
  const watchedAdminFees = form.watch('adminFees');
  const watchedTaxPercentage = form.watch('taxPercentage');

  useEffect(() => {
    const calculatedSubTotal =
      (watchedDialysisFee || 0) +
      (watchedGeneratorDialyzer || 0) +
      (watchedMedConsumables || 0) +
      (watchedNursingCare || 0) +
      (watchedAdminFees || 0);
    setSubTotal(calculatedSubTotal);
  }, [
    watchedDialysisFee,
    watchedGeneratorDialyzer,
    watchedMedConsumables,
    watchedNursingCare,
    watchedAdminFees,
  ]);

  useEffect(() => {
    const calculatedTaxAmount = (subTotal * (watchedTaxPercentage || 0)) / 100;
    setTaxAmount(calculatedTaxAmount);
    setTotalToPay(subTotal + calculatedTaxAmount);
  }, [subTotal, watchedTaxPercentage]);

  const onSubmit = async (values: TaxeFormValues) => {
    const dataToSend = { ...values, subTotal, taxAmount, totalToPay };
    console.log('Formulaire soumis (Données validées côté client):', dataToSend);

    try {
      const response = await fetch('/api/taxe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Formulaire soumis avec succès ! Réponse du serveur : ' + result.message);
        form.reset();
        // Optionnel: Déclencher le téléchargement PDF après soumission réussie
        handleDownloadPdf();
      } else {
        const errorData = await response.json();
        alert('Erreur lors de la soumission du formulaire : ' + (errorData.message || 'Erreur inconnue.'));
      }
    } catch (error) {
      console.error('Erreur réseau ou problème de communication avec le serveur :', error);
      alert('Une erreur réseau est survenue. Veuillez vérifier votre connexion.');
    }
  };

  // Fonction pour générer et télécharger le PDF
  const handleDownloadPdf = async () => {
    if (formContentRef.current) { // Utiliser formContentRef ici
      const input = formContentRef.current;
      // Optionnel: Agrandir l'élément temporairement pour une meilleure résolution PDF
      input.style.transform = 'scale(1)'; // Réinitialiser si modifié
      input.style.transformOrigin = 'top left';

      // Pour s'assurer que tout le contenu est visible (important pour les longs formulaires)
      const canvas = await html2canvas(input, {
        scale: 2, // Augmente la résolution du canvas pour un PDF plus net
        useCORS: true, // Si vous avez des images externes, assurez-vous que CORS est géré
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' pour portrait, 'mm' pour millimètres, 'a4' pour le format de page

      const imgWidth = 210; // Largeur de la page A4 en mm
      const pageHeight = 297; // Hauteur de la page A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("facture_dialyse.pdf");
      input.style.transform = ''; // Réinitialiser le style après capture
    } else {
      alert("Impossible de capturer le formulaire pour le PDF. L'élément n'est pas trouvé.");
    }
  };

  return (
    // Conteneur général pour la page (incluant les boutons et le formulaire)
    <div className="container mx-auto p-4 max-w-3xl bg-gray-100 rounded-lg my-8">
      {/* Boutons d'action en haut - Ceux-ci restent HORS de la zone de capture PDF */}
      <div className="flex justify-between items-center mb-6 px-4 py-2 bg-white shadow-md rounded-lg">
        <Button onClick={() => router.push('/dashboard/admin')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au Tableau de Bord
        </Button>
        <Button onClick={handleDownloadPdf} className="bg-green-600 hover:bg-green-700 text-white">
          <Download className="h-4 w-4 mr-2" /> {/* Ajout de l'icône de téléchargement ici */}
          Télécharger PDF
        </Button>
      </div>

      {/* Conteneur du formulaire - C'est SEULEMENT CETTE PARTIE QUI SERA CAPTURÉE POUR LE PDF */}
      <div ref={formContentRef} className="bg-white shadow-lg rounded-lg p-6">
        {/* Reste du formulaire (inchangé par rapport à la version précédente) */}
        <div className="text-center mb-8 border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-700">Centre Hospitalier Universitaire (CHU Agadir)</h2>
          <p className="text-sm text-gray-600">Adresse : CHU Agadir, 80000 Agadir, Maroc</p>
          <p className="text-sm text-gray-600">Tél : 0528 564 512</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section Informations Patient */}
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Informations Patient</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom et Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom complet du patient" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalRecordNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° Dossier Médical</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: DM00123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sessionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de la Séance</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sessionTimeFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure (Début)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sessionTimeTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure (Fin)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsibleDoctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médecin Responsable</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du médecin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-8">Détail des Frais</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="dialysisFee"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <Label htmlFor="dialysisFee" className="flex-1">Séance de dialyse</Label>
                    <FormControl>
                      <Input
                        id="dialysisFee"
                        type="number"
                        {...field}
                        onChange={field.onChange}
                        className="w-[150px] text-right"
                      />
                    </FormControl>
                    <FormMessage className="ml-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="generatorDialyzer"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <Label htmlFor="generatorDialyzer" className="flex-1">Générateur + dialyseur</Label>
                    <FormControl>
                      <Input
                        id="generatorDialyzer"
                        type="number"
                        {...field}
                        onChange={field.onChange}
                        className="w-[150px] text-right"
                      />
                    </FormControl>
                    <FormMessage className="ml-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medConsumables"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <Label htmlFor="medConsumables" className="flex-1">Médicaments et consommables</Label>
                    <FormControl>
                      <Input
                        id="medConsumables"
                        type="number"
                        {...field}
                        onChange={field.onChange}
                        className="w-[150px] text-right"
                      />
                    </FormControl>
                    <FormMessage className="ml-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nursingCare"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <Label htmlFor="nursingCare" className="flex-1">Soins infirmiers spécialisés</Label>
                    <FormControl>
                      <Input
                        id="nursingCare"
                        type="number"
                        {...field}
                        onChange={field.onChange}
                        className="w-[150px] text-right"
                      />
                    </FormControl>
                    <FormMessage className="ml-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adminFees"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <Label htmlFor="adminFees" className="flex-1">Frais administratifs</Label>
                    <FormControl>
                      <Input
                        id="adminFees"
                        type="number"
                        {...field}
                        onChange={field.onChange}
                        className="w-[150px] text-right"
                      />
                    </FormControl>
                    <FormMessage className="ml-4" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end items-center space-x-4 font-bold text-lg mt-4">
              <span className="text-gray-700">Sous-total :</span>
              <span className="text-blue-600">{subTotal.toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-end items-center space-x-4 font-bold text-lg">
              <span className="text-gray-700">
                Taxe (
                <FormField
                  control={form.control}
                  name="taxPercentage"
                  render={({ field }) => (
                    <Input
                      type="number"
                      {...field}
                      onChange={field.onChange}
                      className="w-20 inline-block text-right"
                    />
                  )}
                />
                %) :
              </span>
              <span className="text-blue-600">{taxAmount.toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-end items-center space-x-4 font-extrabold text-xl border-t pt-4 mt-4">
              <span className="text-gray-800">Total à Payer :</span>
              <span className="text-green-700">{totalToPay.toFixed(2)} MAD</span>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-8">Mode de Paiement</h3>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={() => (
                <FormItem>
                  <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Espèces', 'Chèque', 'Virement', 'CNOPS', 'RAMED', 'Assurance privée'].map((method) => (
                      <FormField
                        key={method}
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={method}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(method)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, method])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== method
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {method}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence de paiement</FormLabel>
                  <FormControl>
                    <Input placeholder="Référence (si applicable)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-8">Observations</h3>
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Notes ou observations supplémentaires" {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-end mt-12 pt-8 border-t border-dashed border-gray-300">
              <div className="text-center flex-1">
                <Label>Signature Patient :</Label>
                <div className="border-b border-black w-3/4 mx-auto mt-2 h-6"></div>
              </div>
              <div className="text-center flex-1">
                <Label>Cachet du Centre :</Label>
                <div className="border-b border-black w-3/4 mx-auto mt-2 h-6"></div>
              </div>
            </div>

<Button type="submit" className="w-full mt-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white">              Générer la Facture
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TaxeForm;