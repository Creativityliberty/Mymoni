"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Globe,
  DollarSign,
  Bell,
  Users,
  Shield,
  Palette,
  Database,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Réglages</h1>
        <p className="text-muted-foreground">
          Configurez votre workspace et vos préférences
        </p>
      </div>

      {/* Workspace Settings */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-primary/10 p-2">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Workspace</h2>
            <p className="text-sm text-muted-foreground">
              Informations générales de votre espace de travail
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nom du workspace
            </label>
            <Input defaultValue="Demo Workspace" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Devise par défaut
            </label>
            <select className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CHF">CHF (Fr.)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Fuseau horaire</label>
            <Input defaultValue="Europe/Paris" disabled />
            <p className="text-xs text-muted-foreground mt-1">
              Les alertes seront envoyées selon ce fuseau horaire
            </p>
          </div>
        </div>
      </div>

      {/* Alerts Settings */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-amber-500/10 p-2">
            <Bell className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Alertes</h2>
            <p className="text-sm text-muted-foreground">
              Configurez les notifications et rappels
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border">
            <div>
              <p className="font-medium">Renouvellements</p>
              <p className="text-sm text-muted-foreground">
                Alertes avant échéance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">J-14</Badge>
              <Badge variant="secondary">J-7</Badge>
              <Badge variant="secondary">J-3</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border">
            <div>
              <p className="font-medium">Fin d'essai</p>
              <p className="text-sm text-muted-foreground">
                Alertes avant fin de période d'essai
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">J-7</Badge>
              <Badge variant="secondary">J-3</Badge>
              <Badge variant="secondary">J-1</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border">
            <div>
              <p className="font-medium">Pics de coût</p>
              <p className="text-sm text-muted-foreground">
                Détecter les augmentations inhabituelles
              </p>
            </div>
            <Badge>Activé</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border">
            <div>
              <p className="font-medium">Email quotidien</p>
              <p className="text-sm text-muted-foreground">
                Résumé des alertes actives
              </p>
            </div>
            <Badge variant="secondary">Désactivé</Badge>
          </div>
        </div>
      </div>

      {/* Team Settings */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-blue-500/10 p-2">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Équipe</h2>
            <p className="text-sm text-muted-foreground">
              Gérez les membres et leurs permissions
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                D
              </div>
              <div>
                <p className="font-medium">demo@subsensei.com</p>
                <p className="text-sm text-muted-foreground">Vous</p>
              </div>
            </div>
            <Badge>Admin</Badge>
          </div>

          <Button variant="outline" className="w-full">
            <Users className="mr-2 h-4 w-4" />
            Inviter un membre
          </Button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-rose-500/10 p-2">
            <Shield className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Sécurité</h2>
            <p className="text-sm text-muted-foreground">
              Paramètres de sécurité et confidentialité
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border">
            <div>
              <p className="font-medium">Authentification à deux facteurs</p>
              <p className="text-sm text-muted-foreground">
                Sécurisez votre compte avec 2FA
              </p>
            </div>
            <Badge variant="secondary">Désactivé</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border">
            <div>
              <p className="font-medium">Sessions actives</p>
              <p className="text-sm text-muted-foreground">1 appareil connecté</p>
            </div>
            <Button variant="outline" size="sm">
              Gérer
            </Button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-purple-500/10 p-2">
            <Palette className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Apparence</h2>
            <p className="text-sm text-muted-foreground">
              Personnalisez l'interface
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl border">
          <div>
            <p className="font-medium">Thème</p>
            <p className="text-sm text-muted-foreground">
              Clair, sombre ou automatique
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              ☀️ Clair
            </Button>
            <Button variant="outline" size="sm">
              🌙 Sombre
            </Button>
            <Button variant="outline" size="sm">
              🔄 Auto
            </Button>
          </div>
        </div>
      </div>

      {/* Data & Export */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-emerald-500/10 p-2">
            <Database className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Données</h2>
            <p className="text-sm text-muted-foreground">
              Exportez ou supprimez vos données
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Exporter toutes les données (CSV)
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Exporter toutes les données (JSON)
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
          >
            Supprimer le workspace
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Annuler</Button>
        <Button>Enregistrer les modifications</Button>
      </div>
    </div>
  );
}
