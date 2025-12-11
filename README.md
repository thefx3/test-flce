Need to write all the sub functions in back end 
When I need one. 

============== CLIENT-USER ================
Functions to implement : 
#PROGRESS BAR FOR THE TEST

Users can do the test multiple times 
--> Warning the user 
--> Display the last one in the admin dashboard
--> Possibility to display all of them 
--> Display by Season as well



============== CLIENT-ADMIN ===============
Pages : 
- Dashboard : overview of the last tests + statistics
- Users : his personnal data, his test, his level + to grade him
    - Au Pairs : 
    - Non Au Pair :
- Tests : see all tests - filter by graded / ungraded
+ possibility to grade
- Manual Grading : Grade all the tests ungraded 
- Statistics : in details

=====DASHBOARD
- Nombre total de tests pour la saison en cours 
- Nombre total de tests à corriger
- Le taux de réussite moyen des tests de la saison en cours (sur 27 QCM, reponses bonnes = ... /27) 

======ADMIN
- Affiche des comptes : 
    > Nom, Prénom, Age?, mail
    > Role : Admin
    > Photo?
    > Gérer 
> Bouton : Ajouter un compte 
    > Nom, Prénom 
    > Mail, Mdp
    > Role

- (Gérer) = Gestion des comptes admins 
    > Modification, suppression

======USERS 
- Nombres d'utilisateurs / 1 utilisateur peut faire plusieurs fois le test 
- Les stats des niveaux des élèves (A0 - C1)
- Répartitions AU PAIR / NON AU PAIR

- Derniers utilisateurs créés (test faits) 
    > Création le, Nom, Prenom, Age, Nationalité, Au Pair?, Score_pending, Corriger
    > Voir l'utilisateur 
    > Corriger le test 
/!\ On peut voir plusieurs lignes, élèves qui font le test plusieurs fois.
    > Possible de ne corriger que le dernier test
    > Pas possible de corriger les autres tests




