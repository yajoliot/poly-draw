import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';

@Component({
  selector: 'app-userguide',
  templateUrl: './userguide.component.html',
  styleUrls: ['./userguide.component.scss']
})
export class UserguideComponent implements OnInit {
  show: boolean;
  selectedButton: ElementRef | undefined;
  @ViewChild('Welcome', { static: false, read: ElementRef }) welcomeRef: ElementRef;
  @ViewChild('Pencil', { static: false, read: ElementRef }) pencilRef: ElementRef;
  @ViewChild('Brush', { static: false, read: ElementRef }) brushRef: ElementRef;
  @ViewChild('Line', { static: false, read: ElementRef }) lineRef: ElementRef;
  @ViewChild('Rectangle', { static: false, read: ElementRef }) rectangleRef: ElementRef;
  @ViewChild('Color', { static: false, read: ElementRef }) colorRef: ElementRef;
  @ViewChild('Next', { static: false, read: ElementRef }) nextRef: ElementRef;
  @ViewChild('Previous', { static: false, read: ElementRef }) previousRef: ElementRef;
  @ViewChild('accordion', { static: true }) accordion: MatAccordion;
  @ViewChild('Annuler', { static: false, read: ElementRef }) annulerRef: ElementRef;
  @ViewChild('Sauvegarder', { static: false, read: ElementRef }) sauvegarderRef: ElementRef;
  @ViewChild('Galerie', { static: false, read: ElementRef }) galerieRef: ElementRef;
  @ViewChild('Filtrage', { static: false, read: ElementRef }) filtrageRef: ElementRef;
  @ViewChild('Exporter', { static: false, read: ElementRef }) exporterRef: ElementRef;
  @ViewChild('Selection', { static: false, read: ElementRef }) selectionRef: ElementRef;
  @ViewChild('DeplacementSelection', { static: false, read: ElementRef }) deplacementselectionRef: ElementRef;
  @ViewChild('Efface', { static: false, read: ElementRef }) effaceRef: ElementRef;
  @ViewChild('Applicateur', { static: false, read: ElementRef }) applicateurRef: ElementRef;
  @ViewChild('Pipette', { static: false, read: ElementRef }) pipetteRef: ElementRef;
  @ViewChild('Polygone', { static: false, read: ElementRef }) polygoneRef: ElementRef;
  @ViewChild('Ellipse', { static: false, read: ElementRef }) ellipseRef: ElementRef;
  @ViewChild('Grille', { static: false, read: ElementRef }) grilleRef: ElementRef;
  @ViewChild('Continuer', { static: false, read: ElementRef }) continuerRef: ElementRef;
  @ViewChild('Sceau', { static: false, read: ElementRef }) sceauRef: ElementRef;
  @ViewChild('SauvegardeAuto', { static: false, read: ElementRef }) sauvegardeAutoRef: ElementRef;

  welcomeGuide: string;
  pencilGuide: string;
  brushGuide: string;
  welcomeGuide2: string;
  pencilGuide2: string;
  welcomeGuide3: string;
  brushGuide2: string;
  lineGuide2: string;
  lineGuide: string;
  rectangleGuide: string;
  rectangleGuide2: string;
  colorGuide2: string;
  colorGuide: string;
  annulerGuide: string;
  annulerGuide2: string;
  sauvegarderGuide: string;
  sauvegarderGuide2: string;
  index: number;
  allExpandState: boolean;
  isOpen: boolean;
  galerieGuide2: string;
  galerieGuide: string;
  filtrageGuide: string;
  filtrageGuide2: string;
  exporterGuide: string;
  exporterGuide2: string;
  selectionGuide: string;
  selectionGuide2: string;
  deplacementSelectionGuide: string;
  deplacementSelectionGuide2: string;
  effaceGuide: string;
  effaceGuide2: string;
  applicateurGuide: string;
  applicateurGuide2: string;
  pipetteGuide: string;
  pipetteGuide2: string;
  polygoneGuide: string;
  polygoneGuide2: string;
  ellipseGuide: string;
  ellipseGuide2: string;
  grilleGuide: string;
  grilleGuide2: string;
  continuerGuide: string;
  continuerGuide2: string;
  sceauGuide: string;
  sceauGuide2: string;
  sauvegardeAutoGuide: string;
  sauvegardeAutoGuide2: string;

  constructor(private location: Location) {
    this.show = false;
  }

  ngOnInit(): void {
    this.welcomeGuide = "Bienvenue dans le guide de l'utilisateur";
    this.welcomeGuide2 = 'Ce guide contient toutes les informations sur l' + "'" + 'utilisation des différents outils, '
      + 'options et paramètres de Poly-Draw. Pour naviguer, utilisez la table des matières à gauche'
      + 'ou utilisez les boutons précédent et suivant et découvrez comment utiliser chacune de nos'
      + 'fonctionnalités à leur plein potentiel.';
    this.index = 1;
  }

  cancel(): void {
    this.location.back(); // <-- go back to previous location on cancel
  }
  toggleExpandState(): void {
    if (!this.allExpandState) {
      this.accordion.openAll();
    } else {
      this.accordion.closeAll();
    }
    this.allExpandState = !this.allExpandState;
  }

  selectTool(tool: number): void {
    this.index = tool;
    this.eraseGuide();
    this.buttonToggle(tool);
  }
  visiblePrevious(): boolean {
    if (this.index === 1) {
      return false;
    } else {
      return true;
    }
  }
  visibleNext(): boolean {
    if (this.index === 22) {
      return false;
    } else {
      return true;
    }
  }
  next(): void {
    if (this.index < 22) {
      this.index++;
    } else {
      this.index = 1;
    }
    this.eraseGuide();
    this.buttonToggle(this.index);
  }
  previous(): void {
    if (this.index > 1) {
      this.index--;
    } else {
      this.index = 22;
    }
    this.eraseGuide();
    this.buttonToggle(this.index);
  }
  buttonToggle(value: number): void {
    if (typeof this.selectedButton !== 'undefined') {
      this.selectedButton.nativeElement.style.backgroundColor = '#0274A9';
    }
    switch (value) {
      case 1: // Welcome
        this.selectedButton = this.welcomeRef;
        this.toggleWelcome();
        break;
      case 2: // Continuer un dessin
        this.selectedButton = this.continuerRef;
        this.toggleContinuer();
        break;
      case 3: // Sauvegarde automatique
        this.selectedButton = this.sauvegardeAutoRef;
        this.toggleSauvegardeAuto();
        break;
      case 4: // Sauvegarder
        this.selectedButton = this.sauvegarderRef;
        this.toggleSauvegarder();
        break;
      case 5: // Galerie
        this.selectedButton = this.galerieRef;
        this.toggleGalerie();
        break;
      case 6: // Filtrage
        this.selectedButton = this.filtrageRef;
        this.toggleFiltrage();
        break;
      case 7: // Exporter
        this.selectedButton = this.exporterRef;
        this.toggleExporter();
        break;
      case 8: // Pencil
        this.selectedButton = this.pencilRef;
        this.togglePencil();
        break;
      case 9: // Brush
        this.selectedButton = this.brushRef;
        this.toggleBrush();
        break;
      case 10: // Line
        this.selectedButton = this.lineRef;
        this.toggleLine();
        break;
      case 11: // Efface
        this.selectedButton = this.effaceRef;
        this.toggleEfface();
        break;
      case 12: // Selection
        this.selectedButton = this.selectionRef;
        this.toggleSelection();
        break;
      case 13: // Deplacement Selection
        this.selectedButton = this.deplacementselectionRef;
        this.toggleDeplacementSelection();
        break;
      case 14: // Grille
        this.selectedButton = this.grilleRef;
        this.toggleGrille();
        break;
      case 15: // Annuler
        this.selectedButton = this.annulerRef;
        this.toggleAnnulerRefaire();
        break;
      case 16: // Sceau
        this.selectedButton = this.sceauRef;
        this.toggleSceau();
        break;
      case 17: // Rectangle
        this.selectedButton = this.rectangleRef;
        this.toggleRectangle();
        break;
      case 18: // Polygone
        this.selectedButton = this.polygoneRef;
        this.togglePolygone();
        break;
      case 19: // Ellipse
        this.selectedButton = this.ellipseRef;
        this.toggleEllipse();
        break;
      case 20: // Palette
        this.selectedButton = this.colorRef;
        this.toggleColor();
        break;
      case 21: // Applicateur
        this.selectedButton = this.applicateurRef;
        this.toggleApplicateur();
        break;
      case 22: // Pipette
        this.selectedButton = this.pipetteRef;
        this.togglePipette();
        break;

    }
    if (typeof this.selectedButton !== 'undefined') {
      this.selectedButton.nativeElement.style.backgroundColor = '#7434eb';
    }

  }

  eraseGuide(): void {
    this.welcomeGuide = '';
    this.welcomeGuide2 = '';
    this.pencilGuide = '';
    this.pencilGuide2 = '';
    this.brushGuide = '';
    this.brushGuide2 = '';
    this.lineGuide = '';
    this.lineGuide2 = '';
    this.rectangleGuide = '';
    this.rectangleGuide2 = '';
    this.colorGuide = '';
    this.colorGuide2 = '';
    this.annulerGuide = '';
    this.annulerGuide2 = '';
    this.sauvegarderGuide = '';
    this.sauvegarderGuide2 = '';
    this.galerieGuide = '';
    this.galerieGuide2 = '';
    this.filtrageGuide = '';
    this.filtrageGuide2 = '';
    this.exporterGuide = '';
    this.exporterGuide2 = '';
    this.selectionGuide = '';
    this.selectionGuide2 = '';
    this.deplacementSelectionGuide = '';
    this.deplacementSelectionGuide2 = '';
    this.effaceGuide = '';
    this.effaceGuide2 = '';
    this.applicateurGuide = '';
    this.applicateurGuide2 = '';
    this.pipetteGuide = '';
    this.pipetteGuide2 = '';
    this.polygoneGuide = '';
    this.polygoneGuide2 = '';
    this.ellipseGuide = '';
    this.ellipseGuide2 = '';
    this.grilleGuide = '';
    this.grilleGuide2 = '';
    this.continuerGuide = '';
    this.continuerGuide2 = '';
    this.sceauGuide = '';
    this.sceauGuide2 = '';
    this.sauvegardeAutoGuide = '';
    this.sauvegardeAutoGuide2 = '';
  }

  toggleWelcome(): void {
    this.welcomeGuide = "Bienvenue dans le guide de l'utilisateur";
    this.welcomeGuide2 = "Ce guide contient toutes les informations sur l'utilisation des différents outils"
      + ', options et paramètres de Poly-Draw. Pour naviguer, utilisez la table des'
      + ' matières à gauche ou utilisez les boutons précédent et suivant et découvrez'
      + 'comment utiliser chacune de nos fonctionnalités à leur plein potentiel.';
    this.welcomeGuide3 = '';
  }

  togglePencil(): void {
    this.pencilGuide = 'Crayon';
    this.pencilGuide2 = "Le crayon est l'outil de base de Poly-Draw. Il n'est utilisé que pour créer des lignes"
      + ' simples sans texture particulière. Il a une pointe ronde. Le crayon utilise la couleur '
      + " principale et vous pouvez configurer l'épaisseur du trait avec l'outil au-dessus de l'écran."
      + ' Vous pouvez dessiner avec le crayon tout en maintenant le bouton gauche de la souris enfoncé.';
  }

  toggleBrush(): void {
    this.brushGuide = 'Pinceau';
    this.brushGuide2 = 'Le pinceau est similaire au crayon. Il ne diffère que par la texture de la ligne.'
      + " Le pinceau utilise la couleur principale et vous pouvez configurer l'épaisseur et"
      + " la texture de la ligne à l'aide des outils en haut de l'écran. Poly-draw offre un"
      + ' choix de cinq textures différentes. Vous pouvez dessiner avec le pinceau tout en maintenant'
      + ' le bouton gauche de la souris enfoncé.';
  }
  toggleLine(): void {
    this.lineGuide = 'Ligne';
    this.lineGuide2 = "Cet outil vous permet de dessiner une ligne d'un ou plusieurs segments. Un premier clic"
      + ' définit la position de départ de la ligne. Ensuite, chaque clic qui suit se connecte au'
      + " clic qui le précède pour former un segment de la ligne. Vous pouvez voir un segment d'aperçu"
      + ' temporaire à tout moment entre le pointeur de la souris et le dernier clic. Vous pouvez terminer'
      + " le tracé de la ligne par un double-clic. Vous pouvez créer des segments alignés avec l'axe X"
      + ' selon un angle multiple de 45 degrés en maintenant la touche MAJ enfoncée. Pour annuler le traçage de'
      + ' ligne complète, utilisez la touche ÉCHAP. Vous pouvez supprimer le dernier point (jonction confirmée)'
      + ' avec la touche RETOUR ARRIÈRE.';
  }
  toggleRectangle(): void {
    this.rectangleGuide = 'Rectangle';
    this.rectangleGuide2 = 'Cet outil vous permet de dessiner des rectangles. Vous pouvez dessiner des rectangles'
      + ' sur la surface de dessin par glisser-déposer. Vous pouvez également faire un carré '
      + ' en appuyant sur la touche MAJ lors de votre glisser-déposer.Il est possible de configurer'
      + " l'épaisseur du contour mais aussi le type de tracé (Contour: nous ne dessinons que les contours,"
      + " Solide: nous ne dessinons que l'intérieur, sans les contours, Solide avec contour: nous dessinons"
      + " l'intérieur et les contours du rectangle).";
  }
  toggleColor(): void {
    this.colorGuide = 'Palette';
    this.colorGuide2 = 'Vous avez accès à un outil de couleur qui vous permet de sélectionner une couleur primaire et secondaire.'
      + ' Ceci est partagé par tous les outils et se trouve dans la table attributaire en haut de la page. La couleur'
      + ' primaire est utilisée pour le dessin et la couleur secondaire est utilisée pour les contours'
      + " lorsqu'il y en a. Il est possible d'inverser les 2 couleurs et de définir la transparence pour chaque couleur."
      + ' La sélection des couleurs se fait via la palette de couleurs qui vous permet de sélectionner la couleur ou de'
      + ' saisir les valeurs RVB en hexadécimal. Le système stocke également les 10 dernières couleurs utilisées. Le clic'
      + ' gauche change la couleur primaire et le clic droit change la couleur secondaire.';
  }
  toggleAnnulerRefaire(): void {
    this.annulerGuide = 'Annuler/refaire';
    this.annulerGuide2 = 'Vous pouvez annuler ou refaire vos dernières actions. Une action signifie toute intervention menant à l’ajout, '
      + " la suppression ou la modification d’objets sur la surface de dessin. Il est possible d'annuler une action avec"
      + ' le raccourci `CTRL + Z` et il est possible de refaire une action avec le raccourci `CTRL + SHIFT + Z`.';
  }
  toggleContinuer(): void {
    this.continuerGuide = 'Continuer un dessin';
    this.continuerGuide2 = 'Cette fonctionnalité charge dans son état le plus récent, le dernier dessin ouvert dans l’application web avant que celle-ci'
      + ' n’ait été fermée. Cela vous permet de rapidement poursuivre votre travail sans avoir à sauvegarder puis charger à nouveau le dessin à chaque'
      + " fois. De plus, cela offre la possibilité de « récupérer » le dessin en cas de crash du système ou de  l’application."
      + " L’option continuer un dessin compte sur un système de sauvegarde automatique qui fonctionne en arrière-plan sans intervention de l’utilisateur.";
  }
  toggleSauvegardeAuto(): void {
    this.sauvegardeAutoGuide = 'Sauvegarde Automatique';
    this.sauvegardeAutoGuide2 = "Vous pouvez sauvegarder automatiquement mon dessin pendant son édition. La sauvegarde est locale."
      + " La sauvegarde est déclenchée après : la création d'un dessin, le chargement d'un dessin ou après toute modification du dessin en cours d'édition."
      + " Vous pouvez ouvrir un dessin sauvegardé automatiquement seulement à travers l'option Continuer un dessin.";
  }
  toggleSauvegarder(): void {
    this.sauvegarderGuide = 'Sauvegarder';
    this.sauvegarderGuide2 = "Vous pouvez sauvegarder un dessin sur le serveur. Il est possible d'entrer un nom ainsi que plusieurs"
      + ' étiquettes. L’usage des étiquettes est optionnel et vous pouvez sauvegarder votre dessin sans en'
      + " spécifier. Il est possible d'ouvrir la fenêtre de sauvegarde avec le raccourci  `CTRL + S`.";
  }
  toggleGalerie(): void {
    this.galerieGuide = 'Galerie de dessin';
    this.galerieGuide2 = 'Vous pouvez ouvrir un dessin déjà créé et sauvegardé sur le server à partir de la galerie de dessins.'
      + ' Chaque dessin présent dans la liste comporte un nom, des étiquettes (s’il y en a), et une'
      + " représentation du dessin en format réduit. Il est possible d'ouvrir la fenêtre de Galerie"
      + ' avec le raccourci  `CTRL + G`.';
  }
  toggleFiltrage(): void {
    this.filtrageGuide = 'Filtrage par étiquettes';
    this.filtrageGuide2 = 'Vous pouvez filtrer les dessins obtenues du serveur par une ou plusieurs étiquettes.'
      + ' Lorsqu’une ou plusieurs étiquettes sont sélectionnées, seulement les dessins qui'
      + ' contiennent au moins une des étiquettes sont visibles. Si aucune étiquette n’est choisie, tous'
      + ' les dessins sont visibles.';
  }
  toggleExporter(): void {
    this.exporterGuide = 'Exporter';
    this.exporterGuide2 = 'Vous pouvez exporter votre dessin dans les formats suivants : JPG, PNG, SVG  localement. Vous pouvez également'
      + " envoyer le dessin par courriel. Dans ce cas, vous devez fournir un nom d’auteur et l’adresse du destinataire."
      + " Vous pouvez appliquer un filtre sur l'image avant de l'exporter. Il est possible d'ouvrir"
      + " la fenêtre d'export avec le raccourci `CTRL + E`.";
  }
  toggleSelection(): void {
    this.selectionGuide = 'Sélection et inversion de sélection';
    this.selectionGuide2 = "Vous pouvez sélectionner un ou plusieurs objet et/ou inverser l'êtat de sélection d'un objet."
      + " Vous pouvez également sélectionner un objet en faisant un clic simple sur l'objet avec le bouton"
      + " gauche de la souris. Note : le clic doit être sur l'objet même. Je dois aussi être capable de faire"
      + ' une sélection à travers un glisser-déposer de la même manière que l’on dessine, par exemple, des rectangles'
      + ' (outil Rectangle). Voici les étapes: 1) Le bouton gauche de la souris est enfoncé. La position du pointeur'
      + ' définit celle d’un premier coin du potentiel rectangle. « Potentiel », parce que si le bouton est relâché'
      + ' avant un déplacement, il s’agira d’un simple clic. 2) L’utilisateur déplace la souris. Le rectangle de'
      + ' sélection est officiellement créé. Il doit être représenté à l’écran par un cadre en pointillé.'
      + ' L’intérieur peut être coloré, mais si c’est le cas, un effet de transparence est requis. 3) Le bouton est'
      + ' relâché. Le rectangle de sélection n’ayant plus d’utilité, il disparait. 4) Tous les objets qui ont été'
      + ' touchés par le rectangle sélection sont maintenant sélectionnés et peuvent être manipulés. Il est possible'
      + " de sélectionner l'outil Sélection avec la touche `S` et il est possible de sélectionner tous les objets sur"
      + ' la surface de dessin avec le raccourci `CTRL + A`';
  }
  toggleDeplacementSelection(): void {
    this.deplacementSelectionGuide = "Déplacement/Rotation/Manipulation d'une sélection";
    this.deplacementSelectionGuide2 = "DÉPLACEMENT: Vous pouvez déplacer une sélection. Ceci se fait à l'aide d'un glisser-déposer avec le bouton gauche"
      + ' de la souris. Vous pouvez déplacer une sélection avec les touches directionnelles (flêches)'
      + ' du clavier. Vous pouvez déplacer la sélection de 3 pixels dans la direction de la touche appuyée.'
      + ' ROTATION: Vous pouvez faire pivoter une sélection autour de son centre avec la roulette de la souris. ou de la touche SHIFT'
      + ' À chaque cran de roulette, une rotation de 15 degrés est effectuée. Si la touche ALT est enfoncée, la rotation est de 1 degré.'
      + " MANIPULATION: À l'aide du presse papier vous pouvez manipuler une sélection et effectuer les actions suivantes."
      + " Vous pouvez couper une sélection (CTRL + X), c'est-à-dire transférer les objets sélectionnés dans le presse-papier."
      + " Vous pouvez copier une sélection (CTRL + V), c'est-à-dire dupliquer les objets sélectionnés dans le presse-papier."
      + " Vous pouvez coller une sélection, c'est-à-dire dupliquer les objets dans le presse-papier sur la surface de dessin."
      + ' Vous pouvez dupliquer une sélection (CTRL + D), des nouveaux objets sont présents sur la surface de dessin et sont automatiquement sélectionnés.'
      + " Vous pouvez supprimer une sélection (DELETE), c'est-à-dire retirer les objets sélectionnés de la surface de dessin.";
  }
  toggleEfface(): void {
    this.effaceGuide = 'Efface';
    this.effaceGuide2 = 'Vous pouvez effacer des objets de la surface de dessin avec un clic du bouton gauche ou un glisser-déposer.'
      + " Il est possible de sélectionner l'outil Efface avec la touche `E`.";
  }
  toggleApplicateur(): void {
    this.applicateurGuide = 'Applicateur de couleur';
    this.applicateurGuide2 = 'Vous pouvez changer la couleur à un objet déjà dessiné en cliquant dessus. Un clic avec le bouton'
      + ' gauche sur un objet fera changer sa couleur pour la couleur principale. Un clic avec le bouton droit'
      + ' sur un objet fera changer la couleur de bordure, s’il en a une, pour la couleur secondaire. Il est'
      + " possible de sélectionner l'outil Applicateur de couleur avec la touche `R`.";
  }
  togglePipette(): void {
    this.pipetteGuide = 'Pipette';
    this.pipetteGuide2 = "Vous pouvez choisir une couleur en utilisant l'outil pipette. La couleur saisie est celle du pixel"
      + ' sous le pointeur de la souris. Vous pouvez assigner la couleur saisie à la couleur principale avec'
      + ' un clic gauche. Vous pouvez assigner la couleur saisie à la couleur secondaire avec un clic droit.'
      + " Il est possible de sélectionner l'outil Pinceau avec la touche `I`.";
  }
  toggleSceau(): void {
    this.sceauGuide = 'Sceau de peinture';
    this.sceauGuide2 = "Vous pouvez remplir une région de la couleur principale en utilisant l'outil sceau de peinture."
      + " Vous pouvez configurer la tolérance d'écart (en pourcentage) pour le remplissage. La tolérance d'écart permet de définir"
      + " l'étendue de la région à remplir. La forme crée pourra être manipulée par les autres outils"
      + " Il est possible de sélectionner l'outil Sceau de Peinture avec la touche `B`";
  }
  togglePolygone(): void {
    this.polygoneGuide = 'Polygone';
    this.polygoneGuide2 = 'Vous pouvez dessiner des polygones sur la surface de dessin en faisant un glisser-déposer.'
      + ' Vous pouvez configurer le nombre de côtés du polygone (3 à 12). On doit pouvoir configurer'
      + " l'épaisseur du contour mais aussi le type de tracé: - Contour: on ne dessine que les contours"
      + " - Plein: on ne dessine que l'intérieur, sans les contours - Plein avec contour: on dessine l'intérieur"
      + ' et les contours du rectangle';
  }
  toggleEllipse(): void {
    this.ellipseGuide = 'Ellipse';
    this.ellipseGuide2 = 'Vous pouvez dessiner des ellipses sur la surface de dessin en faisant un glisser-déposer. Je'
      + ' dois aussi pouvoir en faire un cercle en appuyant sur la touche `SHIFT` pendant mon glisser-déposer.'
      + " Vous pouvez configurer l'épaisseur du contour mais aussi le type de tracé: - Contour: on ne dessine"
      + " que les contours - Plein: on ne dessine que l'intérieur, sans les contours - Plein avec contour: on"
      + "dessine l'intérieur et les contours du rectangle. Il est possible de sélectionner l'outil Ellipse"
      + ' avec la touche `2`.';
  }
  toggleGrille(): void {
    this.grilleGuide = 'Grille';
    this.grilleGuide2 = 'Vous pouvez afficher une grille sur ma surface de dessin. La grille doit être superposée à la surface' +
      + ' et son contenu. Son point d’origine est le coin supérieur gauche de la surface. Vous pouvez également' +
      + ' activer ou désactiver la grille, lui assigner une valeur de transparence et finalement indiquer la taille'
      + '(en pixels) des carrés la composant. Il est possible de faire afficher (et de masquer) la grille avec la'
      + " touche `G`. Il est possible d'augmenter la taille des carrés de la grille au prochain multiple de 5 avec"
      + 'le raccourci `+` et de diminuer la taille des carrés de la grille au prochain multiple de 5 avec le'
      + 'raccourci `-`';
  }

  getLocation(): Location {
    return this.location;
  }

  getAccordion(): MatAccordion {
    return this.accordion;
  }

}
