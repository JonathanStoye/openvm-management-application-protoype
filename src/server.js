import Koa from 'koa'
import Router from 'koa-router'
import * as jsonld from 'jsonld'
import N3 from 'n3'

const app = new Koa()
const router = new Router()

// logger
app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// Set defaults for the api
app.use(async (ctx, next) => {
  ctx.type = 'application/json'
  await next()
})

router.get('/example', async (ctx, next) => {
  var doc = {
    'http://schema.org/name': 'Manu Sporny',
    'http://schema.org/url': { '@id': 'http://manu.sporny.org/' },
    'http://schema.org/image': {
      '@id': 'http://manu.sporny.org/images/manu.png',
    },
  }

  var context = {
    name: 'http://schema.org/name',
    homepage: { '@id': 'http://schema.org/url', '@type': '@id' },
    image: { '@id': 'http://schema.org/image', '@type': '@id' },
  }

  const compacted = await jsonld.compact(doc, context)
  ctx.body = JSON.stringify(compacted)
})

router.get('/', async (ctx, next) => {
  const rdfParser = N3.Parser({ format: 'Turtle' })
  const rdf = await rdfParser.parse(
    `
    @prefix adms:  <http://www.w3.org/ns/adms#> .
@prefix owl:   <http://www.w3.org/2002/07/owl#> .
@prefix skosxl: <http://www.w3.org/2008/05/skos-xl#> .
@prefix org:   <http://www.w3.org/ns/org#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix iso-thes: <http://purl.org/iso25964/skos-thes#> .
@prefix skos:  <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix at:    <http://publications.europa.eu/ontology/authority/> .
@prefix dct:   <http://purl.org/dc/terms/> .
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix esco:  <http://data.europa.eu/esco/model#> .
@prefix rov:   <http://www.w3.org/ns/regorg#> .
@prefix dcat:  <http://www.w3.org/ns/dcat#> .
@prefix euvoc: <http://publications.europa.eu/ontology/euvoc#> .
@prefix prov:  <http://www.w3.org/ns/prov#> .
@prefix foaf:  <http://xmlns.com/foaf/0.1/> .
@prefix qdr:   <http://data.europa.eu/esco/qdr#> .

<http://data.europa.eu/esco/label/9f7da187-956b-42cc-a0ef-f31319d035e8>
        a                   skosxl:Label ;
        skosxl:literalForm  "předmět výuky"@cs .

<http://data.europa.eu/esco/label/9a68daa7-4ed7-4f2b-a17a-6d7ddccdaed3>
        a                   skosxl:Label ;
        skosxl:literalForm  "hantera kvalitetssystem för skor"@sv .

<http://data.europa.eu/esco/label/a56d4349-d96b-4b15-93fa-08c2ada4e1ff>
        a                   skosxl:Label ;
        skosxl:literalForm  "posługiwać się sprzętem ogrodniczym"@pl .

<http://data.europa.eu/esco/label/98570af6-b237-4cdd-b555-98fe3de26ef8>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "particleboard machine technician"@en .

<http://data.europa.eu/esco/label/78db6724-1432-47cc-8a73-aaf3ae5e604c>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "lucrătoare la instalația de concasare și măcinare a boabelor de cacao"@ro .

<http://data.europa.eu/esco/label/ee1b6cf0-1cf2-46a6-9926-f078db0a8d2e>
        a                   skosxl:Label ;
        skosxl:literalForm  "carry out stunts"@en .

<http://data.europa.eu/esco/label/12533996-3cb9-4d16-947e-8c47503b2963>
        a                   skosxl:Label ;
        skosxl:literalForm  "pričati priču"@hr .

<http://data.europa.eu/esco/label/2432cc7a-ed52-4428-ad97-5dc241734f38>
        a                   skosxl:Label ;
        skosxl:literalForm  "management of desalination control system"@en .

<http://data.europa.eu/esco/label/81552dd0-7535-410e-851c-5dfb1ad2589b>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "begeleidster van personen met een leerstoornis"@nl .

<http://data.europa.eu/esco/label/95a25e56-12ba-4727-8328-45ff32a365f7>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" ;
        skosxl:literalForm  "nadzornik izgradnje cesta"@hr .

<http://data.europa.eu/esco/label/1da33c19-1a70-4485-aaf1-f48c39101397>
        a                   skosxl:Label ;
        skosxl:literalForm  "make choices"@en .

<http://data.europa.eu/esco/label/f5b51fe2-0467-4f67-ab48-9ec835ac9edf>
        a                   skosxl:Label ;
        skosxl:literalForm  "připravovat vzorky mléka"@cs .

<http://data.europa.eu/esco/label/6a107882-7576-4866-9b69-6d582cdf59ca>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "pulp paper operator"@en .

<http://data.europa.eu/esco/label/4992b9c3-faeb-4fad-a15e-8c2a30124228>
        a                   skosxl:Label ;
        skosxl:literalForm  "ideoloġiji politiċi"@mt .

<http://data.europa.eu/esco/label/f999b37c-2013-4e0c-b60d-5cc994335bb9>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "voorman dakwerk"@nl .

<http://data.europa.eu/esco/label/74644472-08a3-4ee8-bb29-6ccca25a103e>
        a                   skosxl:Label ;
        skosxl:literalForm  "obair i bhfoirne ildisciplíneacha a bhaineann le cúram éigeandála"@ga .

<http://data.europa.eu/esco/label/f0ef4ba6-63ff-4a71-b6f6-ceb01879f9b4>
        a                   skosxl:Label ;
        skosxl:literalForm  "аранжиране на маси"@bg .

<http://data.europa.eu/esco/label/cf7c2404-0fc5-4691-b40b-68fba0519543>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "pricing and marketing manager"@en .

<http://data.europa.eu/esco/label/cea5f5e1-95b7-466e-a4fb-6f32921ab2b3>
        a                   skosxl:Label ;
        skosxl:literalForm  "určiť odtiene farby"@sk .

<http://data.europa.eu/esco/label/0ef2588d-3a92-4273-a40a-692760e4a8b8>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "intermediaria mobiliare"@it .

<http://data.europa.eu/esco/label/99810241-dc28-429f-85c8-14d48b1d14fb>
        a                   skosxl:Label ;
        skosxl:literalForm  "préparer les moteurs principaux pour les opérations de navigation"@fr .

<http://data.europa.eu/esco/label/7a97e772-694f-4252-b68a-62fda8905a68>
        a                   skosxl:Label ;
        skosxl:literalForm  "skilur ritaða víetnömsku"@is .

<http://data.europa.eu/esco/label/001eb041-c759-4540-afc7-bddc49cdea05>
        a                   skosxl:Label ;
        skosxl:literalForm  "mit der Zielgruppe kommunizieren"@de .

<http://data.europa.eu/esco/label/e8e36b24-e49b-4500-9f66-64e531331c1d>
        a                   skosxl:Label ;
        skosxl:literalForm  "studera priser på träprodukter"@sv .

<http://data.europa.eu/esco/label/da8ce059-36f2-4487-a822-614614685a77>
        a                   skosxl:Label ;
        skosxl:literalForm  "faanyagot számba vesz"@hu .

<http://data.europa.eu/esco/label/10136092-b705-4fa7-81ec-7ea6030540fc>
        a                   skosxl:Label ;
        skosxl:literalForm  "developing codified movements"@en .

<http://data.europa.eu/esco/label/4313ba8f-794c-4649-8893-698136f166ad>
        a                   skosxl:Label ;
        skosxl:literalForm  "planlegge flislegging"@no .

<http://data.europa.eu/esco/relation/540B461E-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/72d1e9ca-294c-4349-90ed-f99541d447d0> ;
        esco:target            <http://data.europa.eu/esco/skill/f7b5d916-52f0-4865-b6a6-e1a3b711cb5e> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/essential-skill> .

<http://data.europa.eu/esco/label/a2c2b3c4-d849-4315-b291-4b864acfec4d>
        a                   skosxl:Label ;
        skosxl:literalForm  "meghatározza az IKT felhasználói igényeket"@hu .

<http://data.europa.eu/esco/label/7cd2241f-484a-4e6b-b80d-a00da3ad7acc>
        a                   skosxl:Label ;
        skosxl:literalForm  "developing mechatronic test procedures"@en .

<http://data.europa.eu/esco/label/b35f519c-749d-4535-8f3c-db686db797ae>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "geólogo"@es .

<http://data.europa.eu/esco/label/d4623328-f5e7-456b-b248-5e9b525247e1>
        a                   skosxl:Label ;
        skosxl:literalForm  "triediť tabakové listy"@sk .

<http://data.europa.eu/esco/label/974cce75-f201-43dc-9000-4e0c04468daf>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "ošetřovatelka paznehtů"@cs .

<http://data.europa.eu/esco/label/4583fe28-e7f0-4763-8868-0b91f4366d9f>
        a                   skosxl:Label ;
        skosxl:literalForm  "tiús gloine a choinneáil"@ga .

<http://data.europa.eu/esco/label/b9d5d03f-0a55-410f-b4c0-c41a801fa50b>
        a                   skosxl:Label ;
        skosxl:literalForm  "gå på turistevenemang"@sv .

<http://data.europa.eu/esco/label/2f196abc-14d4-4622-90ac-ac8ef5f74615>
        a                   skosxl:Label ;
        skosxl:literalForm  "voertuigbekleding voorbereiden"@nl .

<http://data.europa.eu/esco/label/de184a90-353a-416a-82d6-73cbc9a3b536>
        a                   skosxl:Label ;
        skosxl:literalForm  "effettuare la sabbiatura tra gli strati"@it .

<http://data.europa.eu/esco/label/8dc6378d-7ef6-4b52-8b32-9e28e40e40ed>
        a                   skosxl:Label ;
        skosxl:literalForm  "assess animal behaviour"@en .

<http://data.europa.eu/esco/label/35acc276-3ba2-4081-82c4-e091b43d8d02>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "assistent for distributionschef inden for fisk, krebsdyr og bløddyr"@da .

<http://data.europa.eu/esco/relation/5A475EFA-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/547b304b-9a72-4717-9b24-b7046df5f64e> ;
        esco:target            <http://data.europa.eu/esco/skill/3d95f056-879d-4012-84fd-19666211ef3a> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/label/6c2e0066-a3cd-4a84-9cd6-edceb6cb4357>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" ;
        skosxl:literalForm  "projektant systemów i podzespołów pneumatycznych"@pl .

<http://data.europa.eu/esco/label/86781a30-ad1d-485f-9e17-1730e47384f7>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "διαχειρίστρια λαχειοφόρου αγοράς"@el .

<http://data.europa.eu/esco/label/d9f35961-5938-40c0-882a-5da4c4789776>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "verkoper op een reisbureau"@nl .

<http://data.europa.eu/esco/label/d9f17e01-8855-494e-95e5-b2be4698b4fb>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "ital-nagykereskedelmi ügyintéző"@hu .

<http://data.europa.eu/esco/label/6c28d26e-9b6d-4c3b-89da-e39ae97dd93a>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "radnica za socijalni rad i savjetovanje"@hr .

<http://data.europa.eu/esco/label/1d904b2c-7c53-45dd-913f-5057abbb5b42>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "kokoonpanija, purjekangastuotteet"@fi .

<http://data.europa.eu/esco/label/c0eeade3-4fd0-41e9-98c9-baf042646317>
        a                   skosxl:Label ;
        skosxl:literalForm  "fabricare de robinete și vane"@ro .

<http://data.europa.eu/esco/relation/52CCF6D0-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/2ac509e8-2850-42c3-b11d-d24077a7921b> ;
        esco:target            <http://data.europa.eu/esco/skill/31c69100-b612-4a61-8db5-fd314318854c> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/essential-skill> .

<http://data.europa.eu/esco/label/b280f5e9-9d9c-49e8-b436-089500330166>
        a                   skosxl:Label ;
        skosxl:literalForm  "Prüftätigkeiten vorbereiten"@de .

<http://data.europa.eu/esco/relation/53158436-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/dc52966e-72db-4ad0-b3a9-5e17f1311ab8> ;
        esco:target            <http://data.europa.eu/esco/skill/f60416d5-2d98-4401-ba0d-b92b53e01d86> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/label/f42f448f-ab50-4c49-a944-8fbc7b7daa79>
        a                   skosxl:Label ;
        skosxl:literalForm  "финансови пазари"@bg .

<http://data.europa.eu/esco/label/b0977230-410a-4753-8e33-defb65389efa>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "художничка на 3D компютърна анимация"@bg .

<http://data.europa.eu/esco/label/8a280f38-426b-4593-9163-fc782b11f5ab>
        a                   skosxl:Label ;
        skosxl:literalForm  "formular propuestas de proyectos artísticos"@es .

<http://data.europa.eu/esco/label/c0fcf386-78b4-4d23-8ffa-c689aaf0c1e4>
        a                   skosxl:Label ;
        skosxl:literalForm  "analyze  network bandwidth requirements"@en-us .

<http://data.europa.eu/esco/relation/55F7F27F-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/53cdcc84-e5ee-488c-aa09-88084e06d6d7> ;
        esco:target            <http://data.europa.eu/esco/skill/2d6904db-9e16-42a5-bc12-c5acb8bfab18> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/label/62cd5130-7bff-4d4c-acfa-75dae0aad959>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "billarmsinstallatör"@sv .

<http://data.europa.eu/esco/label/ce6dbb1e-be04-461a-a2be-968f59072e14>
        a                   skosxl:Label ;
        skosxl:literalForm  "javno zdravje"@sl .

<http://data.europa.eu/esco/label/d3837c25-6004-4b81-8059-bb1951262c9b>
        a                   skosxl:Label ;
        skosxl:literalForm  "córais ghrúdaireachta nua-aimseartha"@ga .

<http://data.europa.eu/esco/label/5496add4-be46-429e-82ec-22fe0cc872cd>
        a                   skosxl:Label ;
        skosxl:literalForm  "attīrīt medu no putekšņiem"@lv .

<http://data.europa.eu/esco/isco/C4221/label/1F9B4278-ECED-11E5-A8F8-F968891CE521>
        a                   skosxl:Label ;
        skosxl:literalForm  "Empregados das agências de viagem e similares"@pt .

<http://data.europa.eu/esco/label/255b43ee-e40b-46cb-82d2-607a4d7e0643>
        a                   skosxl:Label ;
        skosxl:literalForm  "evaluate potential end-user conflicts"@en .

<http://data.europa.eu/esco/label/7d62f9aa-786d-4c1c-8450-4fa74ad1eefd>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "kemijsko-procesni tehničar za separaciju zraka"@hr .

<http://data.europa.eu/esco/label/0ed9a0a0-13b4-4b2a-a0a1-3f9576b3b1fe>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/neutral" ;
        skosxl:literalForm  "vyresnysis gaminių kūrėjas"@lt .

<http://data.europa.eu/esco/label/2b632393-72b6-40e3-b479-328871938892>
        a                   skosxl:Label ;
        skosxl:literalForm  "preverjati dokumentacijo dobaviteljev glede sestavin"@sl .

<http://data.europa.eu/esco/label/ec5418a9-07da-4c29-b233-42b57c36c3ed>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "kőolajszivattú-rendszer kezelője"@hu .

<http://data.europa.eu/esco/label/c317594a-a4b3-40cc-b69a-c6bb57fd97a5>
        a                   skosxl:Label ;
        skosxl:literalForm  "davati upute u ortodontskim postupcima"@hr .

<http://data.europa.eu/esco/label/0e83c00b-96d6-472b-8e07-8094e90ec7b0>
        a                   skosxl:Label ;
        skosxl:literalForm  "administer territory planning"@en .

<http://data.europa.eu/esco/label/fe529cc0-903a-49f2-8fc8-5dbcd1b1300a>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "gestora de carga de las TIC"@es .

<http://data.europa.eu/esco/node-literal/be2adfdb-38c9-4ea3-b229-590e61b5fb1a>
        a                 esco:NodeLiteral ;
        esco:language     "en" ;
        esco:nodeLiteral  "Ensure safety during ground-handling procedures, maintain ground service equipment, and conduct equipment checks." .

<http://data.europa.eu/esco/relation/55B48E62-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/9b3c6dd8-4d3b-4a12-8bb8-55bb2e92c3a6> ;
        esco:target            <http://data.europa.eu/esco/skill/1da6ee69-335b-48a7-b806-ee487807c0e4> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/label/fae76d91-5b98-403b-9c45-2cc0fc584f08>
        a                   skosxl:Label ;
        skosxl:literalForm  "hors d’oeuvre a ullmhú"@ga .

<http://data.europa.eu/esco/label/e5b596f8-8a9e-40d2-91b7-cecbdf73cd66>
        a                   skosxl:Label ;
        skosxl:literalForm  "produkta dzīves cikla dokumentācijas nodrošināšana"@lv .

<http://data.europa.eu/esco/label/c95eaf3d-7bde-4838-8f1d-300530b0ec93>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "operatriċi tal-makkinarju tal-kontrolli numeriċi bil-kompjuter"@mt .

<http://data.europa.eu/esco/label/9c415a98-a554-4538-86c1-8ba63f2f52ce>
        a                   skosxl:Label ;
        skosxl:literalForm  "vorbește norvegiana"@ro .

<http://data.europa.eu/esco/isco/C6112>
        a                       skos:Concept ;
        dct:description         <http://data.europa.eu/esco/node-literal/21aa2f8e-e689-4411-ae69-4d0a6a8196a8> ;
        skos:broader            <http://data.europa.eu/esco/isco/C611> ;
        skos:broaderTransitive  <http://data.europa.eu/esco/isco/C611> , <http://data.europa.eu/esco/isco/C61> , <http://data.europa.eu/esco/isco/C6> ;
        skos:inScheme           <http://data.europa.eu/esco/concept-scheme/occupations> , <http://data.europa.eu/esco/concept-scheme/isco> ;
        skos:narrower           <http://data.europa.eu/esco/occupation/b865693a-eb11-44cc-bf6c-38e5b4d7e169> , <http://data.europa.eu/esco/occupation/1fc60ca6-c3ea-4aeb-bf3b-350c0c5e7f93> , <http://data.europa.eu/esco/occupation/a6af318e-8a3a-4266-a1ef-cf7afe588201> , <http://data.europa.eu/esco/occupation/c56295bb-ef33-4ccd-a929-59e3dd73f876> , <http://data.europa.eu/esco/occupation/8b304664-ba25-45fe-a5bf-80c727943a86> , <http://data.europa.eu/esco/occupation/5aeaea2f-6585-4d3d-8f3e-1fdd9903aa32> ;
        skos:notation           "6112"^^<http://data.europa.eu/esco/Notation/ISCO08> , "6112" ;
        skos:prefLabel          "Odlare av träd och buskar"@sv , "Sadownicy"@pl , "Hedelmäpuiden ja pensaiden ym. kasvattajat"@fi , "Lavoratori agricoli specializzati di coltivazioni legnose agrarie"@it , "Vaismedžių ir vaiskrūmių augintojai"@lt , "Voćari/voćarke, vinogradari/vinogradarke i srodna zanimanja"@hr , "Drevesničarji/drevesničarke, gojitelji/gojiteljice grmičevja"@sl , "Arboriculteurs et ouvriers qualifiés de l’arboriculture"@fr , "Baum- und Strauchfrüchteanbauer"@de , "Arboricultori"@ro , "Fruittelers"@nl , "Tree and shrub crop growers"@en , "Ovocnáři, vinaři, chmelaři a ostatní pěstitelé plodů rostoucích na stromech a keřích"@cs , "Ħaddiema involuti fit-tkabbir tas-siġar u tal-arbuxelli"@mt , "Καλλιεργητές δένδρων και θάμνων"@el , "Koku un krūmu audzētāji"@lv , "Trabalhadores qualificados de árvores e arbustos"@pt , "Puuvilja- ja marjakasvatajad"@et , "Pestovatelia stromových a kríkových plodín"@sk , "Csemete- és cserjegondozók"@hu , "Лесовъди и работници, отглеждащи трайни насаждения"@bg , "Agricultores y trabajadores calificados de plantaciones de árboles y arbustos"@es , "Dyrkning af afgrøder fra træer og buske"@da , "Frukt- og bærprodusenter"@no ;
        skosxl:prefLabel        <http://data.europa.eu/esco/isco/C6112/label/1E6E81B2-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8220-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E809A-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E80EA-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E823E-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8202-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E81E4-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E80CC-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8108-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8126-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8158-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/label/d534534b-a900-4bdd-bd5c-584a2c6a9649> , <http://data.europa.eu/esco/isco/C6112/label/1E6E807C-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E813A-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E805E-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E81C6-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8176-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8270-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E802C-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8194-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8252-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/label/ae446eb1-6641-4338-a0fd-f954e823370b> , <http://data.europa.eu/esco/isco/C6112/label/1E6E8040-ECED-11E5-A8F8-F968891CE521> , <http://data.europa.eu/esco/isco/C6112/label/1E6E80B8-ECED-11E5-A8F8-F968891CE521> .

<http://data.europa.eu/esco/label/f1f967cd-deac-46f2-8100-ae11f03ffbf8>
        a                   skosxl:Label ;
        skosxl:literalForm  "digitar em dispositivos eletrónicos"@pt .

<http://data.europa.eu/esco/label/d833f02d-333a-4ad7-b090-a10c8ecbe758>
        a                   skosxl:Label ;
        skosxl:literalForm  "támogatást nyújt pénzügyi számításokhoz"@hu .

<http://data.europa.eu/esco/label/1436ae0d-41fd-4f81-bedb-182cffe9c945>
        a                   skosxl:Label ;
        skosxl:literalForm  "reproducēt dokumentus"@lv .

<http://data.europa.eu/esco/relation/5AABB2D9-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/773753ad-c4f7-4052-b3b4-440435199d6b> ;
        esco:target            <http://data.europa.eu/esco/skill/a6d697d1-80ba-4175-82d4-43440ed04270> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/essential-skill> .

<http://data.europa.eu/esco/label/eb5d8ebf-3ea5-4488-bac7-e984fea69d31>
        a                   skosxl:Label ;
        skosxl:literalForm  "käyttää vesiliikenteen ohjausjärjestelmiä"@fi .

<http://data.europa.eu/esco/label/072b13c2-b3d7-49a8-acdc-c7a0f7608000>
        a                   skosxl:Label ;
        skosxl:literalForm  "biologia clinica"@it .

<http://data.europa.eu/esco/label/68d33e77-8d1a-41e8-a490-4c8a5f9200db>
        a                   skosxl:Label ;
        skosxl:literalForm  "Schieneninfrastruktur"@de .

<http://data.europa.eu/esco/label/13f02076-2613-4d51-b135-5d84abc84453>
        a                   skosxl:Label ;
        skosxl:literalForm  "undertake soldering and welding quality assurance checks"@en .

<http://data.europa.eu/esco/label/1da9d6e3-2ff7-49e7-8253-b9a8c7b26346>
        a                   skosxl:Label ;
        skosxl:literalForm  "fysiotherapeutisch personeel beheren"@nl .

<http://data.europa.eu/esco/label/324fc15b-4311-405b-b71a-bb00bbda991a>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "responsable de los bosques"@es .

<http://data.europa.eu/esco/label/71822887-1e24-45c7-bbd8-979f45e6226f>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "aviacijos stebėjimo ir kodų koordinavimo vadovas"@lt .

<http://data.europa.eu/esco/label/579f9c2c-4134-400a-9752-ebb32ce8e3f0>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "hautomovastaava, vesiviljely"@fi .

<http://data.europa.eu/esco/label/5f07122f-6e7b-42c3-818c-6dec721442c2>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "scrittrice di discorsi"@it .

<http://data.europa.eu/esco/label/2874d0d9-ee62-4b01-a456-c1d6cf2c7917>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "lõngaketraja"@et .

<http://data.europa.eu/esco/label/320e6224-15a2-46ba-893f-bb3abad841ec>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "televíziós hírolvasó"@hu .

<http://data.europa.eu/esco/relation/58AC91BE-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/2a22ff9e-de3b-408d-b312-5034896cc4f4> ;
        esco:target            <http://data.europa.eu/esco/skill/dfce2aba-783e-4e17-9c17-e74aca505ec2> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/essential-skill> .

<http://data.europa.eu/esco/label/3f8c0d49-3982-4874-99a5-a00221dcdf5b>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "subtitler / adapter"@en .

<http://data.europa.eu/esco/label/3dd87641-cfa8-44aa-9e1c-c49558da519c>
        a                   skosxl:Label ;
        skosxl:literalForm  "ići ukorak s razvojem jezika"@hr .

<http://data.europa.eu/esco/label/9083bce8-1dce-44bc-9559-40d3f323a910>
        a                   skosxl:Label ;
        skosxl:literalForm  "tutkia turvallisuusongelmia"@fi .

<http://data.europa.eu/esco/label/f44b59f7-df06-4681-9b4f-19313f4174c1>
        a                   skosxl:Label ;
        skosxl:literalForm  "Ursachen für ein Ernährungsungleichgewicht verkennen"@de .

<http://data.europa.eu/esco/label/bb0edb99-e589-4f19-b46f-24b3993fa66a>
        a                   skosxl:Label ;
        skosxl:literalForm  "computerprogramma's gebruiken om steno uit te schrijven"@nl .

<http://data.europa.eu/esco/label/86d5c130-06dc-4e71-8431-d32da242ff54>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/neutral" ;
        skosxl:literalForm  "tabletavimo mašinų meistras derintojas"@lt .

<http://data.europa.eu/esco/relation/59899A82-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/57a12047-4f1e-40ed-add5-9736923f231b> ;
        esco:target            <http://data.europa.eu/esco/skill/7a34b3d9-bd3b-4f4e-a0f6-f97439901cb7> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/essential-skill> .

<http://data.europa.eu/esco/relation/5A4765D0-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/de31a27f-c6ba-4d4f-87cd-b405e1852121> ;
        esco:target            <http://data.europa.eu/esco/skill/1b1c2d44-c487-4121-a2ed-dcda651f4d59> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/relation/538F9C3A-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/a10eb17a-3c78-4f7a-a1da-8f31146339d3> ;
        esco:target            <http://data.europa.eu/esco/skill/cad6cbf5-fd1c-40af-8c56-605964d044b5> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/label/20fc02a7-0b45-42e1-b8bc-e932cf12ab15>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "vodja živilske proizvodnje"@sl .

<http://data.europa.eu/esco/label/8031b15a-0ec6-4bde-aff1-16d3e3ab4831>
        a                   skosxl:Label ;
        skosxl:literalForm  "język angielski w lotnictwie"@pl .

<http://data.europa.eu/esco/label/348c774c-5a7f-4c34-853c-f46334f717c7>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "bestyrer af modebutik"@da .

<http://data.europa.eu/esco/label/7cf0a031-a8ea-4877-85a0-587d5d4ed914>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "antreprenor imobiliar"@ro .

<http://data.europa.eu/esco/label/e10dec65-7ad7-4bbf-927b-4fb769b05cad>
        a                   skosxl:Label ;
        skosxl:literalForm  "gestionar competiciones deportivas"@es .

<http://data.europa.eu/esco/label/9f813dd2-c36b-492a-8984-17418a5f8e21>
        a                   skosxl:Label ;
        skosxl:literalForm  "complete coffee tastings"@en .

<http://data.europa.eu/esco/label/98b5738c-f8a9-4a48-985a-ccb3803b7ca0>
        a                   skosxl:Label ;
        skosxl:literalForm  "draw up stage layouts digitally"@en .

<http://data.europa.eu/esco/label/cdb5da80-d0a9-4119-905b-a971dc278b6f>
        a                   skosxl:Label ;
        skosxl:literalForm  "voor veiligheid aan de deur zorgen"@nl .

<http://data.europa.eu/esco/label/8bf94cdc-c945-4239-83da-9dcac1fc5acb>
        a                   skosxl:Label ;
        skosxl:literalForm  "транскрибиране на текстове"@bg .

<http://data.europa.eu/esco/label/27454258-9dd4-4a04-9c87-15e2cc7a0940>
        a                   skosxl:Label ;
        skosxl:literalForm  "atlikti kamieninių ląstelių persodinimą"@lt .

<http://data.europa.eu/esco/label/8c305f48-5a53-40a0-8f4a-297be3bef84d>
        a                   skosxl:Label ;
        skosxl:literalForm  "azionare macchine per mescolare la gomma"@it .

<http://data.europa.eu/esco/label/1ab4d6b7-1526-4adb-97f9-df0224dff548>
        a                   skosxl:Label ;
        skosxl:literalForm  "equip lifeboats"@en .

<http://data.europa.eu/esco/relation/56DF4EB2-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/skill/248894d1-42dc-474f-af6e-2da52ac0c679> ;
        esco:target            <http://data.europa.eu/esco/skill/11eebd42-44ab-401d-8a2c-bdb9fc9beb50> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/label/5f4edaf9-ca6b-4cac-bc18-10f140d21bb8>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "customs compliance manager landbouwmachines en -uitrusting"@nl .

<http://data.europa.eu/esco/label/85b6fbca-cb57-4d79-9e85-3d96148cee0e>
        a                   skosxl:Label ;
        skosxl:literalForm  "kiválasztja a lakk összetevőit"@hu .

<http://data.europa.eu/esco/skill/69282ad4-8793-421e-a42c-636b75f32aac>
        a                        skos:Concept , esco:MemberConcept , esco:Skill ;
        esco:hasAssociation      <http://data.europa.eu/esco/relation/59C2E850-1AD9-11E7-B43F-E10FE2FA9FC2> ;
        esco:isOptionalSkillFor  <http://data.europa.eu/esco/occupation/a784b063-89cf-441b-9624-deed9dbdeae6> ;
        esco:referenceLanguage   "en"^^xsd:language ;
        esco:skillReuseLevel     <http://data.europa.eu/esco/skill-reuse-level/occupation-specific> ;
        esco:skillType           <http://data.europa.eu/esco/skill-type/skill> ;
        dct:description          <http://data.europa.eu/esco/node-literal/44bb11d2-7c48-41a7-a8d8-61d7244aa4d9> , <http://data.europa.eu/esco/node-literal/f8fbff5e-5689-42db-a726-65fa028ce4e9> ;
        dct:modified             "2016-12-20T20:04:40Z"^^xsd:dateTime ;
        iso-thes:status          "released" ;
        skos:altLabel            "solidificar pintura"@es , "añadir endurecedor de pintura"@es , "verfharders toevoegen"@nl , "incorporar endurecedor de pintura"@es , "add paint hardener"@en , "Lackhärter zugeben"@de , "supplement paint hardeners"@en , "append paint hardeners"@en ;
        skos:inScheme            <http://data.europa.eu/esco/concept-scheme/skills> , <http://data.europa.eu/esco/concept-scheme/member-skills> ;
        skos:prefLabel           "add paint hardeners"@en-us , "add paint hardeners"@en , "aggiungere sostanze indurenti alla vernice"@it , "dodawać utwardzacze do farb"@pl , "lisätä maalin kovetinaineita"@fi , "cruaiteoirí péinte a chur isteach"@ga , "värvikuivatusaineid lisama"@et , "přidávat tužidla barev"@cs , "adaugă întăritori pentru vopsea"@ro , "żieda ta’ sustanzi tat-twebbis taż-żebgħa"@mt , "verfverharders toevoegen"@nl , "įmaišyti dažų kietiklio"@lt , "pridávať tvrdidlo do farby"@sk , "pievienot krāsas cietinātājus"@lv , "tilsette malingsherdere"@no , "يضيف مواد تصليد الدهان"@ar , "ajouter des durcisseurs dans de la peinture"@fr , "προσθήκη σκληρυντικών ουσιών στη βαφή"@el , "agregar endurecedor de pintura"@es , "tilsætte hærder til maling"@da , "adicionar endurecedores a tintas"@pt , "bætir máningarherðir"@is , "tillsätta härdare till färg"@sv , "dodavati učvršćivače boje"@hr , "добавяне на втвърдители за боя"@bg , "dodajati sredstva za zgoščevanje barv"@sl , "Farbhärter zugeben"@de , "festékszilárdítót ad a festékhez"@hu ;
        skos:topConceptOf        <http://data.europa.eu/esco/concept-scheme/skills> , <http://data.europa.eu/esco/concept-scheme/member-skills> ;
        skosxl:altLabel          <http://data.europa.eu/esco/label/30610794-ee80-4227-9d6c-ef692049b15c> , <http://data.europa.eu/esco/label/6f897a16-fb0d-4be3-9e0e-62e1f58273e4> , <http://data.europa.eu/esco/label/edae1543-c002-4ffb-9918-06c3ca4fd22e> , <http://data.europa.eu/esco/label/a651675c-547c-45c7-825a-df0a2ff30e2c> , <http://data.europa.eu/esco/label/3d002bfa-1510-496e-b30f-8743b0470a72> , <http://data.europa.eu/esco/label/4b9f7c5c-8efe-406d-9327-79f8f4ac4e2f> , <http://data.europa.eu/esco/label/a65a6ea3-4216-4324-accd-744bf73ccdf2> , <http://data.europa.eu/esco/label/9c55c657-4575-4ccf-9fae-d99f624f6150> ;
        skosxl:prefLabel         <http://data.europa.eu/esco/label/05c49846-09f9-4401-a4dd-7e93424e58db> , <http://data.europa.eu/esco/label/e94c9a24-13e4-495e-a2c4-bb4fa068e7dd> , <http://data.europa.eu/esco/label/38fa48a8-a6ff-45c3-b170-ee23f02acfac> , <http://data.europa.eu/esco/label/759118ff-1a54-4264-85be-71677b9ffae6> , <http://data.europa.eu/esco/label/622ee6bf-13fd-43a3-8b12-0397003c0bb5> , <http://data.europa.eu/esco/label/a39b9b13-4d89-46dc-8c08-bb87c2dda20f> , <http://data.europa.eu/esco/label/399778f0-843a-4bb7-9db7-f0848fda3f50> , <http://data.europa.eu/esco/label/8969eb59-37cb-47ce-84f1-e9bf7431b74b> , <http://data.europa.eu/esco/label/96fecff3-c46a-4af6-be87-c6fd78122a38> , <http://data.europa.eu/esco/label/89e6fa33-c1d2-4be2-b8e4-822aa7644e79> , <http://data.europa.eu/esco/label/3e54944e-dfc4-4a50-bbb5-1e124c6cbb45> , <http://data.europa.eu/esco/label/607cece6-3f5e-448b-ad47-b5f56349d06b> , <http://data.europa.eu/esco/label/c2745745-9c4c-495d-b1e1-b7c8dcdd42cd> , <http://data.europa.eu/esco/label/25b0ec38-587d-491b-a277-ff5471a1815d> , <http://data.europa.eu/esco/label/849e4384-0871-4b23-b290-a98536b5d048> , <http://data.europa.eu/esco/label/98c29dfd-8644-4fdc-8d6c-9ecce35b85e5> , <http://data.europa.eu/esco/label/2dbff8ef-5afc-4544-829c-de3e27196419> , <http://data.europa.eu/esco/label/77c16514-28b3-4e0d-b23b-a6a71ead5241> , <http://data.europa.eu/esco/label/31aebfd6-a6b9-479f-ae6e-f56ea30db9a0> , <http://data.europa.eu/esco/label/310db787-ca23-4864-be24-0133b1070bb1> , <http://data.europa.eu/esco/label/eb4dbb5b-6af1-443e-9aa9-e7b915cbb2f2> , <http://data.europa.eu/esco/label/5bcae3c8-7699-409f-b77e-486eacd8d48e> , <http://data.europa.eu/esco/label/a9b971f7-a4f7-4045-97a6-bbd566d3dcc4> , <http://data.europa.eu/esco/label/29a0600b-3d10-4cef-950b-1fcf3b44f2d2> , <http://data.europa.eu/esco/label/596dd0b5-d8a0-4d51-88c0-aa29fe3baf3a> , <http://data.europa.eu/esco/label/17eeaa50-adde-451b-90a0-03fec2f32fa5> , <http://data.europa.eu/esco/label/7228e45b-9e3c-4d90-ba4f-78e870f95aaf> , <http://data.europa.eu/esco/label/d4e77cb9-4511-412f-982c-cb991b0da64b> .

<http://data.europa.eu/esco/label/bd7cf163-6696-46f2-811b-a7631d1d5961>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" ;
        skosxl:literalForm  "asamblor de echipamente electrice"@ro .

<http://data.europa.eu/esco/label/eefc7018-29f7-4e95-921d-00978a20da8b>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "surface miner (heavy equipment)"@en .

<http://data.europa.eu/esco/label/27476d61-fef5-43a7-825a-d296fb6b86d3>
        a                   skosxl:Label ;
        skosxl:literalForm  "ينتج مكونات القِيثَارَة"@ar .

<http://data.europa.eu/esco/label/bbeb6465-2c39-424d-8f0c-bfbbda600089>
        a                   skosxl:Label ;
        skosxl:literalForm  "huolehtia varaston kierrosta"@fi .

<http://data.europa.eu/esco/relation/5303712E-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/e34b93ec-5e11-4858-ba1e-e245c4c39cec> ;
        esco:target            <http://data.europa.eu/esco/skill/3edfcb2b-2d0e-4673-87ce-f55c37eb5fca> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/label/5857A24B4BE06F00090002B1>
        a                   skosxl:Label ;
        skosxl:literalForm  "fárahúzógép kezelő"@hu .

<http://data.europa.eu/esco/label/5c69be7d-b34b-4ebd-80d4-61dc3f56fe69>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" ;
        skosxl:literalForm  "начален учител за лица със специални образователни потребности"@bg .

<http://data.europa.eu/esco/relation/5A05A0A0-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/d871af8b-f6d7-4377-b609-d422afe3b5de> ;
        esco:target            <http://data.europa.eu/esco/skill/f75b740c-b36c-495e-bc67-efe347bbc6b5> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/label/5aa130f5-8892-45cb-abc4-f3d8140a49e7>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "assistant wholesale merchant in flowers and plants"@en .

<http://data.europa.eu/esco/node-literal/a38d450e-1b93-4b41-92f3-153f7a530f30>
        a                 esco:NodeLiteral ;
        esco:language     "en-us"^^xsd:language ;
        esco:nodeLiteral  "Change labels on shelves, according to the location of products displayed on vending machines." .

<http://data.europa.eu/esco/label/5f091e9c-73fb-431f-8901-baedc1e6d2e7>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "assistente sociale di comunità per adulti"@it .

<http://data.europa.eu/esco/label/022b20c2-6aa0-4380-b641-110c78313875>
        a                   skosxl:Label ;
        skosxl:literalForm  "operating of welding equipment"@en .

<http://data.europa.eu/esco/label/83cfe5d1-5911-48d5-937b-0ca916f00fb4>
        a                   skosxl:Label ;
        skosxl:literalForm  "upravljati kućnom centralom"@hr .

<http://data.europa.eu/esco/relation/5A26A96C-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/9dbbeb2c-0d51-4c03-8ef6-8dfa7360db22> ;
        esco:target            <http://data.europa.eu/esco/skill/e0b04224-52b4-44c4-9fae-26e9272dfe04> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/essential-skill> .

<http://data.europa.eu/esco/label/6f81e087-a17a-4b8c-8041-6944a37c9f39>
        a                   skosxl:Label ;
        skosxl:literalForm  "نظم النقل الدولي"@ar .

<http://data.europa.eu/esco/skill/885564e4-9818-44ac-a77d-ddfe30b34ed7>
        a                         esco:MemberConcept , esco:Skill , skos:Concept ;
        esco:hasAssociation       <http://data.europa.eu/esco/relation/5A583338-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5ABC5B06-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCEED8-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCF586-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCF2DE-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB162C-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCF4E6-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5ABC5386-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5A58390A-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCEB54-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB1047-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCF0E1-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCEAB5-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB0F9C-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB1320-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB13C1-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB196B-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB0D6C-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCF392-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5A476F44-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5A582FE6-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCEF8C-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCF181-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB147F-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5A4770CA-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCEA15-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB1ADC-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB11AF-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCECC6-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB0CA4-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCF037-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCF22B-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB18B6-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB0E0D-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB10F1-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB1529-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5ABC549E-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCEE2F-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCEC12-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5A68F8B2-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCF446-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52CCED84-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB1A29-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/52BB126D-1AD9-11E7-B43F-E10FE2FA9FC2> ;
        esco:isEssentialSkillFor  <http://data.europa.eu/esco/occupation/63c92723-ee86-42cb-89bf-d93b65398bef> , <http://data.europa.eu/esco/occupation/7d9c060a-f280-441d-baf9-7d4a6b520a2a> , <http://data.europa.eu/esco/occupation/d7a12ff0-7e25-4dab-98c5-1f5a781da8ad> , <http://data.europa.eu/esco/occupation/0cbfa809-2d71-44e5-b736-c4da3c8fe09d> , <http://data.europa.eu/esco/occupation/4c313f2a-704e-4d3c-a7c2-98e1b93c9e94> , <http://data.europa.eu/esco/occupation/42abcbcb-721b-4da6-9c06-f6951969d056> , <http://data.europa.eu/esco/occupation/47b747bb-5bbf-40d5-aa3e-8d4a79238502> , <http://data.europa.eu/esco/occupation/dc2a924c-653a-4922-9226-f6909dd64580> , <http://data.europa.eu/esco/occupation/264b00c9-84d0-4dc9-b590-aed2cea2b904> , <http://data.europa.eu/esco/occupation/c76dda38-938c-404e-8a6d-78c8705eebc0> , <http://data.europa.eu/esco/occupation/38395ab3-766c-4c6c-8d96-430eff19ec8d> , <http://data.europa.eu/esco/occupation/bbba890e-ecae-43ba-9c5b-a65baa318f15> , <http://data.europa.eu/esco/occupation/5cc6d160-3864-43b0-b3eb-77d1208a51b4> , <http://data.europa.eu/esco/occupation/c430500d-0b8b-4ef5-8f91-3e98cff32356> , <http://data.europa.eu/esco/occupation/1ee8dfca-19b0-4e1a-88ed-68548f80951b> , <http://data.europa.eu/esco/occupation/03b55cb5-9735-4582-8e20-2b1cb76635cb> , <http://data.europa.eu/esco/occupation/dc29cd23-d6ba-46b0-bc2f-424e20270099> , <http://data.europa.eu/esco/occupation/5b912733-abc8-43f7-825c-00ae21043685> , <http://data.europa.eu/esco/occupation/ccbb7213-79f7-489e-9dad-f90091e550d0> , <http://data.europa.eu/esco/occupation/00fdad73-4551-4e43-b256-1d4a3759db1e> , <http://data.europa.eu/esco/occupation/972ef593-89c3-468b-aad5-81bc575feb58> , <http://data.europa.eu/esco/occupation/84e4c780-ee17-44dd-af6f-d1c06a3e353d> , <http://data.europa.eu/esco/occupation/95d8f19e-f62b-443f-ac53-324ea8f98cf5> , <http://data.europa.eu/esco/occupation/d9632b0a-3c95-4a8a-a15c-c5413beda52e> , <http://data.europa.eu/esco/occupation/65beb253-61b0-4f8f-9c3c-49419913fd18> , <http://data.europa.eu/esco/occupation/1b3e150f-8ec1-47e2-a2ef-d02632efe0d5> , <http://data.europa.eu/esco/occupation/173a882d-0a14-4919-ac1b-23e8ee8273de> , <http://data.europa.eu/esco/occupation/9faaae26-804d-48f3-97b0-84f7e1aceae8> , <http://data.europa.eu/esco/occupation/b148e7a3-e5b0-4edc-b770-85ab81f36ac9> , <http://data.europa.eu/esco/occupation/12142c2c-9b6f-4e4f-8153-f1a51554e4e0> , <http://data.europa.eu/esco/occupation/e997358a-f6ed-4b5d-bebe-2a33b01ea3d2> , <http://data.europa.eu/esco/occupation/8c0cc417-6b09-4082-8062-2f0f7123a573> , <http://data.europa.eu/esco/occupation/6e873bb0-ff0d-4800-a898-362b9a2e1c47> , <http://data.europa.eu/esco/occupation/4311b9e0-064e-41bc-b120-5eb21f337780> , <http://data.europa.eu/esco/occupation/8914badc-df5e-4671-908e-de5bc795658b> , <http://data.europa.eu/esco/occupation/a70315e3-ae41-44a9-9fe5-7fe668469ee0> , <http://data.europa.eu/esco/occupation/afcf9d03-6e51-4548-8cec-cfa50972929d> , <http://data.europa.eu/esco/occupation/fd00e4bb-dcee-41d7-81d3-2cdebad8fe70> , <http://data.europa.eu/esco/occupation/c71ee6a5-ce48-4afd-aa1e-eaabf17ccbc0> , <http://data.europa.eu/esco/occupation/b2826761-6fc4-4344-9d36-d8455cb6b185> , <http://data.europa.eu/esco/occupation/b49f95f8-c1c8-428f-9f1f-5f5abae55e51> ;
        esco:isOptionalSkillFor   <http://data.europa.eu/esco/occupation/b87a7a27-ee74-4e5e-b274-84a3cab27bf4> , <http://data.europa.eu/esco/occupation/9e81adde-9983-44fa-b74b-c548d0dbfbdd> , <http://data.europa.eu/esco/occupation/7a031723-2b2c-4fdd-8ed5-30d67088b8b8> ;
        esco:referenceLanguage    "en"^^xsd:language ;
        esco:skillReuseLevel      <http://data.europa.eu/esco/skill-reuse-level/sector-specific> ;
        esco:skillType            <http://data.europa.eu/esco/skill-type/skill> ;
        dct:description           <http://data.europa.eu/esco/node-literal/84078d40-4901-464a-bd57-29b88f57b965> , <http://data.europa.eu/esco/node-literal/313ba957-2c28-4779-80cb-5b2e661dadf6> ;
        dct:modified              "2016-12-20T20:40:12Z"^^xsd:dateTime ;
        iso-thes:status           "released" ;
        skos:altLabel             "manage businesses with great care"@en , "monitoring a business with great care"@en , "overseeing a business with great care"@en , "onderneming met veel zorg beheren"@nl , "management of a business with great care"@en , "manage a business with great care"@en , "управляване на бизнеса с голямо внимание"@bg , "supervising a business with great care"@en , "operating a business with great care"@en ;
        skos:broader              <http://data.europa.eu/esco/skill/75d8e5d9-bef3-418b-9011-01bff9f27207> , <http://data.europa.eu/esco/skill/83e6510b-ffeb-4aec-959c-4265fd0ff7b7> ;
        skos:broaderTransitive    <http://data.europa.eu/esco/skill/7ee746cb-fded-47f5-9652-19ebebbce51b> , <http://data.europa.eu/esco/skill/83e6510b-ffeb-4aec-959c-4265fd0ff7b7> , <http://data.europa.eu/esco/skill/a90b12b6-248d-487f-be36-c44bd9a032e5> , <http://data.europa.eu/esco/skill/81c66e05-0b64-4cc5-8707-432f59fb6528> , <http://data.europa.eu/esco/skill/8f18f987-33e2-4228-9efb-65de25d03330> , <http://data.europa.eu/esco/skill/75d8e5d9-bef3-418b-9011-01bff9f27207> ;
        skos:inScheme             <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        skos:prefLabel            "управляване на стопанската дейност с голямо внимание"@bg , "gestire un'azienda con estrema cura"@it , "gestionează o afacere cu simț de răspundere"@ro , "gerir uma empresa diligentemente"@pt , "managing a business with great care"@en-us , "managing a business with great care"@en , "διοίκηση επιχείρησης με ζήλο"@el , "gnólacht a bhainistiú go han-chúramach"@ga , "pozorno voditi posao"@hr , "venovať veľkú pozornosť riadeniu podnikania"@sk , "bedrijf met veel zorg beheren"@nl , "hoitaa liiketoimintaa huolellisesti"@fi , "gérer une entreprise avec le plus grand soin"@fr , "immaniġġjar tan-negozju bil-għaqal"@mt , "vést podnik s náležitou péčí"@cs , "ettevõtet piisava hoolsusega juhtima"@et , "administrere en virksomhed med omhu"@da , "rūpestingai valdyti įmonę"@lt , "zarządzać działalnością przedsiębiorstwa z dużą ostrożnością"@pl , "يدير الأعمال التجارية التي تحتاج إلى عناية فائقة"@ar , "gestionar una empresa minuciosamente"@es , "rūpīgi vadīt uzņēmumu"@lv , "sköta en verksamhet på ett omsorgsfullt sätt"@sv , "administrere en bedrift med stor omhyggelighet"@no , "skrbno voditi podjetje"@sl , "vállalkozást nagy gonddal kezel"@hu , "sér um rekstur fyrirtækis af nákvæmni"@is , "ein Unternehmen mit großer Sorgfalt führen"@de ;
        skosxl:altLabel           <http://data.europa.eu/esco/label/5766205f-e8ce-4d8b-bdd9-f45e83fbcceb> , <http://data.europa.eu/esco/label/a0f3cb44-62e9-4ddd-80b9-dee9825ab2d0> , <http://data.europa.eu/esco/label/a3e2ccd2-6900-4e21-a585-3d7b5fba63f8> , <http://data.europa.eu/esco/label/df4db5c4-d785-452a-b538-a24998618159> , <http://data.europa.eu/esco/label/9864ff0d-c78a-4e6e-b18e-ad7cb6cb1ebd> , <http://data.europa.eu/esco/label/2cc5f432-07fd-427e-b8a1-d33155cbb7ba> , <http://data.europa.eu/esco/label/7cab36f0-f794-4fe1-bbd7-70fde13a6198> , <http://data.europa.eu/esco/label/5785bcfc-8cfe-4221-9203-3a499ff537f8> , <http://data.europa.eu/esco/label/1f6f88fb-0a20-4bef-956e-e919f7b56072> ;
        skosxl:prefLabel          <http://data.europa.eu/esco/label/89ba356a-ee5e-4beb-964f-cba034974be0> , <http://data.europa.eu/esco/label/48e77d95-7f89-4d57-bb84-d711bb6d7579> , <http://data.europa.eu/esco/label/70f3f416-3ae9-4607-95f1-0346238bf2ee> , <http://data.europa.eu/esco/label/d4b27ed1-3eee-4596-8233-bd6d5deb16bd> , <http://data.europa.eu/esco/label/53dcc6b8-3295-4d59-a41a-e01fb02fbb76> , <http://data.europa.eu/esco/label/8e5d39f8-52a3-4b0b-8d59-5c9bf9ad142d> , <http://data.europa.eu/esco/label/e5483d9a-f550-4e76-885e-375949a5a503> , <http://data.europa.eu/esco/label/6a62f397-2d0d-4027-9cbc-6f34d91169c0> , <http://data.europa.eu/esco/label/1715d632-aae9-47f5-831a-f6df523b1171> , <http://data.europa.eu/esco/label/31f743a5-ee44-469d-a462-c54e96dd64eb> , <http://data.europa.eu/esco/label/ca5a3b1e-2c0c-426c-b412-d96cefbc4df0> , <http://data.europa.eu/esco/label/5c15c1bb-c669-4b20-84cf-08370f11e951> , <http://data.europa.eu/esco/label/be9d8c06-df9d-4730-a24d-e8b506deeea5> , <http://data.europa.eu/esco/label/3cf3dadd-9cc2-4a1f-b6ae-7f29fe49e500> , <http://data.europa.eu/esco/label/005a7031-b214-41f4-8995-8cbed4c6c6c5> , <http://data.europa.eu/esco/label/547067db-bbd9-4c49-9837-22b15af22c4c> , <http://data.europa.eu/esco/label/a67fee8d-1dde-4a4d-98ba-fbde2dca549d> , <http://data.europa.eu/esco/label/18f84cf9-33ef-4c8f-8b89-56483a38a96e> , <http://data.europa.eu/esco/label/641ab299-bed8-4970-9f8e-d04ed462d1c1> , <http://data.europa.eu/esco/label/270cf987-8f36-436a-9be2-ecf3b3227af4> , <http://data.europa.eu/esco/label/8492045d-50a9-4755-8fc8-2045cffc493f> , <http://data.europa.eu/esco/label/65cb51b5-0b75-4a6c-9b1e-2d8667d81b9a> , <http://data.europa.eu/esco/label/e04380f8-7af6-4c23-9e00-deb0c3022037> , <http://data.europa.eu/esco/label/77b02fce-5ab9-4ea5-85ef-c418f1ae4686> , <http://data.europa.eu/esco/label/976000c6-9c0a-463c-b0af-14769d04787c> , <http://data.europa.eu/esco/label/9ceb697a-ba34-4ab1-959f-922af5ffcb14> , <http://data.europa.eu/esco/label/c4705992-de3c-435a-84fc-24218548dd54> , <http://data.europa.eu/esco/label/74c356a0-5137-4dab-be8f-09e54ffc0222> .

<http://data.europa.eu/esco/label/48040963-67a7-4983-8fe3-0c3b7790b1fa>
        a                   skosxl:Label ;
        skosxl:literalForm  "Bestandteile von Blasinstrumenten herstellen"@de .

<http://data.europa.eu/esco/label/2d07a8d2-4f97-4bca-8b21-88d186ef5bb0>
        a                   skosxl:Label ;
        skosxl:literalForm  "műveleti kommunikációt tart fenn"@hu .

<http://data.europa.eu/esco/relation/5834146E-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/bcc21c63-7eee-4520-8fa7-43eefd389668> ;
        esco:target            <http://data.europa.eu/esco/skill/65a3a184-7d11-4db9-9b85-281961d1514b> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/essential-skill> .

<http://data.europa.eu/esco/label/3470330b-1d80-46ff-a40a-05720c4ab9df>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" ;
        skosxl:literalForm  "održavatelj opreme za telekomunikaciju"@hr .

<http://data.europa.eu/esco/relation/59463FD0-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/0611f232-b30e-46c7-9c26-2d59b1448e79> ;
        esco:target            <http://data.europa.eu/esco/skill/ed3f3dba-3a35-4ed5-b113-67f4d10ef4c8> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/essential-skill> .

<http://data.europa.eu/esco/label/d23bc49a-a3f9-4aca-89fa-8777012e290a>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "prodavač tabákových výrobků"@cs .

<http://data.europa.eu/esco/label/811f45af-8d91-4a9d-8b60-46d0ecc7399b>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/neutral" ;
        skosxl:literalForm  "tekniku tat-tnissil"@mt .

<http://data.europa.eu/esco/label/baa8863f-a4de-41db-800c-067cea397bc4>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "operatoare la fabricarea de mobilier din material plastic"@ro .

<http://data.europa.eu/esco/label/c775a216-cb49-4e0a-9ff9-5edb4ef91c13>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> , <http://data.europa.eu/esco/label-role/standard-female> , <http://data.europa.eu/esco/label-role/standard-male> ;
        skosxl:literalForm  "checkout supervisor"@en .

<http://data.europa.eu/esco/label/c8e6611a-2210-46f6-88ce-21ae793f273e>
        a                   skosxl:Label ;
        skosxl:literalForm  "communicate verbally in Vietnamese"@en .

<http://data.europa.eu/esco/label/b2cc74d2-8c66-4696-b37d-6bb0fb5082b6>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/neutral" ;
        skosxl:literalForm  "prodavač ortopedických potřeb/prodavačka ortopedických potřeb"@cs .

<http://data.europa.eu/esco/label/4e2ee762-7dde-493a-80f2-41eecd32319a>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "kierownik gabinetu kosmetycznego"@pl .

<http://data.europa.eu/esco/label/00b47b58-97b7-4f8f-8d34-8a38b3c2c0e0>
        a                   skosxl:Label ;
        skosxl:literalForm  "horoscopic astrology"@en .

<http://data.europa.eu/esco/label/ece18021-d694-4587-b571-471a31e38d23>
        a                   skosxl:Label ;
        skosxl:literalForm  "moderni jeziki"@sl .

<http://data.europa.eu/esco/label/e2b5a56c-50fd-4cf6-96d1-67668c79d8b1>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "fish culturist"@en .

<http://data.europa.eu/esco/label/661f7199-2afe-481a-9896-8b279e94ff3f>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" ;
        skosxl:literalForm  "lekċerer universitarju tax-xjenzi farmaċewtiċi"@mt .

<http://data.europa.eu/esco/label/24297084-ce57-4419-ac7a-3db5a5d9e28c>
        a                   skosxl:Label ;
        skosxl:literalForm  "utilizar equipos de pruebas"@es .

<http://data.europa.eu/esco/label/444fd07d-c1ca-40c7-9cb2-1fac21f9b409>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/neutral" ;
        skosxl:literalForm  "agent d’usinage du bois/agente d’usinage du bois"@fr .

<http://data.europa.eu/esco/label/7eab6c40-6570-45d3-b617-94473c062930>
        a                   skosxl:Label ;
        skosxl:literalForm  "инспектиране на кораб"@bg .

<http://data.europa.eu/esco/label/d3a43792-9ace-447c-bfaf-f19134b4f03d>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "hajójavító"@hu .

<http://data.europa.eu/esco/label/68d30bd0-8513-492f-9780-bb79da6dd1d1>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "brass instrument maker"@en .

<http://data.europa.eu/esco/label/02f996fa-728c-4062-b2f2-57e7479e441f>
        a                   skosxl:Label ;
        skosxl:literalForm  "používať ručné nitovacie zariadenia"@sk .

<http://data.europa.eu/esco/label/1160f4c8-5565-4be8-b668-e26e6678b6fa>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" ;
        skosxl:literalForm  "sigurnosni službenik"@hr .

<http://data.europa.eu/esco/label/24948040-84df-4ccc-8f0e-17cfbde06813>
        a                   skosxl:Label ;
        skosxl:literalForm  "Photogenics"@fi .

<http://data.europa.eu/esco/relation/59D3B6DA-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/4ac3c3a0-eb56-491f-8d21-1e5539a05b54> ;
        esco:target            <http://data.europa.eu/esco/skill/80c4d5a3-fe4a-4f6f-9bb0-1f6605f98d43> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/optional-skill> .

<http://data.europa.eu/esco/label/04a4979f-8856-4dea-b7bd-892a52548ac2>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "supervisore di operazioni di montaggio e smontaggio di ponteggi"@it .

<http://data.europa.eu/esco/label/42728b3d-4de1-48e9-afc6-30f411bf6ed0>
        a                   skosxl:Label ;
        skosxl:literalForm  "täyttää lomakkeita"@fi .

<http://data.europa.eu/esco/label/97dcce73-1c37-4a4b-b3ea-7f7bcfa8c057>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" ;
        skosxl:literalForm  "kummerċjant finanzjarju"@mt .

<http://data.europa.eu/esco/label/e2c2aa5c-f156-4d8c-8aed-34de74e9e33b>
        a                   skosxl:Label ;
        skosxl:literalForm  "maankäyttö lentoasemasuunnittelussa"@fi .

<http://data.europa.eu/esco/label/8b8b1355-ffa2-4138-bf8b-4f948064598c>
        a                   skosxl:Label ;
        skosxl:literalForm  "pożizzjonar tal-mużiċisti"@mt .

<http://data.europa.eu/esco/node-literal/30fc7dea-884c-4d87-a513-7f05b7e68b22>
        a                 esco:NodeLiteral ;
        esco:language     "en-us"^^xsd:language ;
        esco:nodeLiteral  "Political scientists study political behavior , activity and systems, including the elements that fall therein. Their study of the field ranges from the origins and evolution of various political systems to topical matters such as decision-making processes, political behavior , political trends, society, and power perspectives. They advise governments and institutional organizations on governance matters." .

<http://data.europa.eu/esco/label/2a4bc23e-2a78-45d3-a067-63ab78d680c5>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "die dresser"@en .

<http://data.europa.eu/esco/label/301e7ddc-30e2-4586-bbe4-e8e3f9f2669c>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "medical-technical device engineer"@en .

<http://data.europa.eu/esco/relation/5583C4A9-1AD9-11E7-B43F-E10FE2FA9FC2>
        a                      esco:AssociationObject ;
        esco:isAssociationFor  <http://data.europa.eu/esco/occupation/78f474ae-c154-4206-ad0f-d8a00e9c541e> ;
        esco:target            <http://data.europa.eu/esco/skill/453b6898-de72-4ff9-b217-4a3cd377e155> ;
        esco:targetFramework   <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        dct:type               <http://data.europa.eu/esco/relationship-type/essential-skill> .

<http://data.europa.eu/esco/label/d115c7f0-ca84-4501-b873-9bb29ef5c3f8>
        a                   skosxl:Label ;
        skosxl:literalForm  "footwear quality technician"@en-us .

<http://data.europa.eu/esco/isco/C134/label/204FDE5E-ECED-11E5-A8F8-F968891CE521>
        a                   skosxl:Label ;
        skosxl:literalForm  "Ledelse af hovedaktiviteten inden for servicefag"@da .

<http://data.europa.eu/esco/label/435d7738-0c26-4b39-864e-55a460076e90>
        a                   skosxl:Label ;
        skosxl:literalForm  "fealsúnacht na matamaitice"@ga .

<http://data.europa.eu/esco/label/ef461626-603c-44c0-a871-c5ea9b5c9792>
        a                   skosxl:Label ;
        skosxl:literalForm  "κατάρτιση ετήσιου προϋπολογισμού εμπορικής προώθησης"@el .

<http://data.europa.eu/esco/label/5f408146-3380-491f-b945-71e83aa4221c>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "masażystka"@pl .

<http://data.europa.eu/esco/label/e33c5afc-87bd-487d-a715-b9dbcbafb581>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "pajsaġġist ta' spazji interni"@mt .

<http://data.europa.eu/esco/label/828e2c1e-87d1-40bf-b4ff-d862fda408c9>
        a                   skosxl:Label ;
        skosxl:literalForm  "créer des compositions florales"@fr .

<http://data.europa.eu/esco/label/9bbeed0d-6b0b-4af0-9a98-a2ea502de45f>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/standard-male" ;
        skosxl:literalForm  "operátor odhŕňača snehu"@sk .

<http://data.europa.eu/esco/label/7314342d-e44d-4eb2-89ca-f40be4b83cdd>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "kleparka"@sl .

<http://data.europa.eu/esco/label/560ede62-ac8c-4281-8a7f-98652ee6151f>
        a                   skosxl:Label ;
        skosxl:literalForm  "pielāgot pilašu vingrinājumus"@lv .

<http://data.europa.eu/esco/node-literal/3b13cef3-5298-4116-b459-f6dd5eae0436>
        a                 esco:NodeLiteral ;
        esco:language     "en-us"^^xsd:language ;
        esco:nodeLiteral  "Dancers interpret ideas, feelings, stories or characters for audiences by using movement and body language mostly accompanied by music. This normally involves interpreting the work of a choreographer or a traditional repertory, although it may sometimes require improvisation." .

<http://data.europa.eu/esco/label/c64f5ac7-0ede-4b45-8b77-dff79f059a46>
        a                   skosxl:Label ;
        skosxl:literalForm  "يدرس القراءة السريعة"@ar .

<http://data.europa.eu/esco/skill/d0c425c6-e3de-465e-923d-d4d30ec4be9b>
        a                         esco:Skill , esco:MemberConcept , skos:Concept ;
        esco:hasAssociation       <http://data.europa.eu/esco/relation/58F1874C-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/591303D6-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5912FEEA-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5856D4F4-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/59130264-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5913052B-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/591306B0-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/590252B6-1AD9-11E7-B43F-E10FE2FA9FC2> , <http://data.europa.eu/esco/relation/5912FDDC-1AD9-11E7-B43F-E10FE2FA9FC2> ;
        esco:isEssentialSkillFor  <http://data.europa.eu/esco/occupation/04f39bfa-bc03-4480-98bc-b18ce4fe4b4b> , <http://data.europa.eu/esco/occupation/caafca69-9faa-4850-8930-a3fa07fea4e6> , <http://data.europa.eu/esco/occupation/cd4f41a5-87a6-4b3c-8ee3-14e6f457c365> ;
        esco:isOptionalSkillFor   <http://data.europa.eu/esco/occupation/1ad59946-d13e-441e-9b36-56e1df055e21> , <http://data.europa.eu/esco/occupation/59c22779-4d89-4bc9-ba8b-d64bea236723> , <http://data.europa.eu/esco/occupation/eda0d957-3c3c-4139-b89a-a18bc9e18897> , <http://data.europa.eu/esco/occupation/a04eedcf-8424-475a-8dc5-f30a9da4b151> , <http://data.europa.eu/esco/occupation/30f3ea93-882a-4525-841c-1d5b4b64076f> , <http://data.europa.eu/esco/occupation/b09acdda-6680-49d1-a411-129610ee3bc0> ;
        esco:referenceLanguage    "en"^^xsd:language ;
        esco:skillReuseLevel      <http://data.europa.eu/esco/skill-reuse-level/cross-sector> ;
        esco:skillType            <http://data.europa.eu/esco/skill-type/knowledge> ;
        dct:description           <http://data.europa.eu/esco/node-literal/df82b827-e70d-4632-8dd7-637df0305fc2> , <http://data.europa.eu/esco/node-literal/64b48e20-fee5-4f63-9cca-2a6294291049> ;
        dct:modified              "2016-12-20T18:05:57Z"^^xsd:dateTime ;
        iso-thes:status           "released" ;
        skos:altLabel             "national accepted accounting principles"@en , "national generally accepted accountancy principles"@en , "national accounting principles which are generally accepted"@en , "national generally accepted accounting principle"@en , "nationell god redovisningssed"@sv , "principes comptables généralement reconnus au niveau national"@fr , "kansalliset yleisesti hyväksytyt kirjanpidon periaatteet"@fi , "nationale Grundsätze ordnungsgemäßer Buchführung"@de , "všeobecné uznávané vnitrostátní účetní zásady"@cs , "principios bursátiles generalmente aceptados"@es , "national generally accepted accounting theories"@en , "nationale algemeen aanvaarde boekhoudprincipes"@nl , "általánosan elfogadott nemzeti számviteli alapelvek"@hu , "fundamentos contables generalmente aceptados"@es ;
        skos:inScheme             <http://data.europa.eu/esco/concept-scheme/member-skills> , <http://data.europa.eu/esco/concept-scheme/skills> ;
        skos:prefLabel            "prinċipji nazzjonali tal-kontabilità ġeneralment aċċettati"@mt , "viðurkenndar þjóðhagslegar reikningsskilaaðferðir"@is , "nationale almindeligt anerkendte regnskabsprincipper"@da , "national generally accepted accounting principles"@en-us , "national generally accepted accounting principles"@en , "nationale algemeen aanvaarde boekhoudbeginselen"@nl , "általánosan elfogadott nemzeti számviteli elvek"@hu , "национални общоприети счетоводни принципи"@bg , "nationellt allmänt accepterade revisionsstandarder"@sv , "prionsabail chuntasaíochta a bhfuil glacadh náisiúnta leo"@ga , "principes comptables nationaux généralement admis"@fr , "národné všeobecne prijaté účtovné zásady"@sk , "generelt aksepterte nasjonale regnskapsprinsipper"@no , "vnitrostátní obecné uznávané účetní zásady"@cs , "riigis üldtunnustatud raamatupidamispõhimõtted"@et , "nationale Grundsätze ordnungsmäßiger Rechnungslegung"@de , "princípios contabilísticos nacionais geralmente aceites"@pt , "nacionaliniai bendrieji apskaitos principai"@lt , "nacionalna splošno sprejeta računovodska načela"@sl , "principios contables generalmente aceptados"@es , "εθνικές γενικώς παραδεκτές λογιστικές αρχές"@el , "principii de contabilitate general acceptate la nivel național"@ro , "kansalliset yleisesti hyväksytyt kirjanpidon käytänteet"@fi , "nacionalna općeprihvaćena računovodstvena načela"@hr , "ogólnie przyjęte krajowe zasady rachunkowości"@pl , "principi contabili nazionali generalmente accettati"@it , "valsts vispārpieņemtie grāmatvedības principi"@lv , "مبادئ المحاسبة الوطنية المقبولة بشكل هام"@ar ;
        skos:topConceptOf         <http://data.europa.eu/esco/concept-scheme/skills> , <http://data.europa.eu/esco/concept-scheme/member-skills> ;
        skosxl:altLabel           <http://data.europa.eu/esco/label/968c648a-89a1-44f0-894f-74cabd0e29a1> , <http://data.europa.eu/esco/label/ff28c5bd-f572-45e8-91d6-af143752c56f> , <http://data.europa.eu/esco/label/5961e85d-c757-4e19-b771-64b09cc050f9> , <http://data.europa.eu/esco/label/db3c0812-68bf-4afd-833d-44c79e62dd96> , <http://data.europa.eu/esco/label/58be468b-456c-4e43-83f2-e0fe980a7a51> , <http://data.europa.eu/esco/label/31f244c4-a304-42cf-a5b8-24cae25adda5> , <http://data.europa.eu/esco/label/c36ff561-05c1-4f89-8846-7baa2c9acd59> , <http://data.europa.eu/esco/label/275b4385-4e66-49fe-bbe1-0be031f3d0a5> , <http://data.europa.eu/esco/label/7d5c44f0-da13-454d-98f4-b54ee5926bec> , <http://data.europa.eu/esco/label/4f3cbb0e-4c41-4f71-9440-c874131f381c> , <http://data.europa.eu/esco/label/de0ea598-b215-4882-8cfd-0a55c7c1dba8> , <http://data.europa.eu/esco/label/96271059-b486-4613-8427-c9152400b094> , <http://data.europa.eu/esco/label/c9852d25-c6b7-4a48-b960-2f0b6b30ad50> , <http://data.europa.eu/esco/label/7275bf2e-9beb-466e-af77-aded2c4c3bc2> ;
        skosxl:prefLabel          <http://data.europa.eu/esco/label/1a55c2c9-9fe8-451e-a5de-3c31c866f86e> , <http://data.europa.eu/esco/label/694b8d3a-5a1b-4973-8f0c-1bc181814580> , <http://data.europa.eu/esco/label/75cc5edb-25d6-4b2c-be9d-0ab1b330978f> , <http://data.europa.eu/esco/label/a76dead3-ab1b-486d-848c-7a15f9d91311> , <http://data.europa.eu/esco/label/8fd8e0fd-69e5-46cc-b46b-b554abe66a21> , <http://data.europa.eu/esco/label/116830af-fe1e-4963-a351-89ba9f515bc1> , <http://data.europa.eu/esco/label/34e2cd30-d108-4982-acc5-f0a98718ff45> , <http://data.europa.eu/esco/label/e9b1772b-8562-4199-ba22-a1771235a656> , <http://data.europa.eu/esco/label/60b0fb0f-39ec-49b7-b05b-72512418e766> , <http://data.europa.eu/esco/label/a7911599-bc41-428a-8fad-a82a4fea0c3a> , <http://data.europa.eu/esco/label/a1059eb0-5676-44bd-8a59-b8901ed5993b> , <http://data.europa.eu/esco/label/537714ad-382a-49a8-8489-46d7a58439b5> , <http://data.europa.eu/esco/label/23e47aa9-75b8-47cf-ab8a-e31c6f7362e9> , <http://data.europa.eu/esco/label/144428b7-36fe-4365-b9a5-d992e05b8c7b> , <http://data.europa.eu/esco/label/9e686848-cb73-4402-bef0-0b253c43056b> , <http://data.europa.eu/esco/label/6a3af653-90f3-4b6a-b3db-d728891b8f97> , <http://data.europa.eu/esco/label/964ce89a-4a06-410d-8858-dc987afbf6a4> , <http://data.europa.eu/esco/label/b0ddd947-8bcf-45bb-b785-67f673cc0abe> , <http://data.europa.eu/esco/label/0b8c46d2-9932-4094-a20c-c94d3b546fbd> , <http://data.europa.eu/esco/label/92dd3c4d-f994-45ae-958e-268588c5bc4b> , <http://data.europa.eu/esco/label/0f0f0138-39eb-4fa9-ae75-bd87fc19f09f> , <http://data.europa.eu/esco/label/bcce0aaa-c93f-4d3b-a006-b8352962b4ac> , <http://data.europa.eu/esco/label/99dc4da4-9500-4be6-b2f6-1af715de0b8e> , <http://data.europa.eu/esco/label/f6d7c83b-34aa-43dd-9796-a051a6f0e023> , <http://data.europa.eu/esco/label/c385e22c-6ea5-4904-9b57-0c5ebf1d9323> , <http://data.europa.eu/esco/label/1427d438-97e2-4b0c-9dd4-35440966b1bc> , <http://data.europa.eu/esco/label/486dfc1d-4125-4794-a8f5-6dd98863c636> , <http://data.europa.eu/esco/label/ae2ad524-e092-4cdf-92f3-a1ad75ee5ac6> .

<http://data.europa.eu/esco/label/1162c218-4c48-44fc-be0c-34a0339d6eda>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "ħaddiema tal-għoli"@mt .

<http://data.europa.eu/esco/label/7b5f3c38-8710-4d0b-8496-34d4477e335b>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "winkelbeveiligster"@nl .

<http://data.europa.eu/esco/label/5a7d9441-184b-4954-b3df-4db07143c2b6>
        a                   skosxl:Label ;
        skosxl:literalForm  "agricultural raw materials, seeds and animal feed products"@en-us .

<http://data.europa.eu/esco/node-literal/dd2e32be-4804-4375-85aa-57cf42bd1313>
        a                 esco:NodeLiteral ;
        esco:language     "en" ;
        esco:nodeLiteral  "Perform all kinds of treatments to improve the health and attractiveness of the facial skin, such as facial masks, scrubs, eyebrow tinting, peels, hair removal and make-up." .

<http://data.europa.eu/esco/label/9b05a984-60d4-4140-a261-89a06b010cce>
        a                   skosxl:Label ;
        skosxl:literalForm  "planlægge belysning af optræden"@da .

<http://data.europa.eu/esco/label/fadcc0b3-d7fd-45d7-a9b0-45f39644508f>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" ;
        skosxl:literalForm  "треньор по артистични умения"@bg .

<http://data.europa.eu/esco/label/61d5c1ab-b2f8-4724-9d9a-2f4f9efeb01a>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" ;
        skosxl:literalForm  "stoelmasseur"@nl .

<http://data.europa.eu/esco/label/1e31d2e1-d567-4c7b-94ac-585eea287eab>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/male" , "http://data.europa.eu/esco/label-role/neutral" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "pracownik naukowo-dydaktyczny w dziedzinie komunikacji"@pl .

<http://data.europa.eu/esco/label/f2f2dd18-6e82-4003-b49a-79e0487d8637>
        a                   skosxl:Label ;
        skosxl:literalForm  "samarbeide med utdanningsinstitusjoner"@no .

<http://data.europa.eu/esco/label/0c2e9188-5a48-4b3e-922d-f723ce66e6c8>
        a                   skosxl:Label ;
        skosxl:literalForm  "atpazīt talantīga studenta īpašības"@lv .

<http://data.europa.eu/esco/label/581C8E41F27D4B000A00012A>
        a                   skosxl:Label ;
        skosxl:literalForm  "chat ügyfélszolgálatos"@hu .

<http://data.europa.eu/esco/label/dc114309-e656-4adf-a2af-5bc721380ebe>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/standard-female" , "http://data.europa.eu/esco/label-role/female" ;
        skosxl:literalForm  "direktorica uvoza i izvoza satova i nakita"@hr .

<http://data.europa.eu/esco/node-literal/fa23cf38-0291-4daf-9c71-149c6740dbf4>
        a                 esco:NodeLiteral ;
        esco:language     "en" ;
        esco:nodeLiteral  "Governors are the main legislators of a nation's unit such as a state or province. They supervise staff, perform administrative and ceremonial duties, and function as the main representative for their governed region. They regulate local governments in their region." .

<http://data.europa.eu/esco/label/17bc31d4-a44d-4c37-a076-bee88f75bf12>
        a                   skosxl:Label ;
        skosxl:literalForm  "определяне на скоростта на машина за прокопаване на тунели"@bg .

<http://data.europa.eu/esco/label/2c7699a8-e702-495b-89f1-3d954dae046b>
        a                   skosxl:Label ;
        esco:hasLabelRole   "http://data.europa.eu/esco/label-role/neutral" ;
        skosxl:literalForm  "probācijas programmu speciālists"@lv .

<http://data.europa.eu/esco/label/e72e0112-184f-483d-b761-535d294790c2>
        a                   skosxl:Label ;
        skosxl:literalForm  "hefur umsjón með tímasetningu verkefna"@is .

<http://data.europa.eu/esco/label/919e29c3-9900-4423-b54b-85eb2b0ea329>
        a                   skosxl:Label ;
        skosxl:literalForm  "über lokale Ereignisse auf dem neuesten Stand bleiben"@de .

<http://data.europa.eu/esco/label/e8df3f3b-1ed0-426f-9bf8-fa060c974029>
        a                   skosxl:Label ;
        esco:hasLabelRole   <http://data.europa.eu/esco/label-role/female> , <http://data.europa.eu/esco/label-role/male> , <http://data.europa.eu/esco/label-role/neutral> ;
        skosxl:literalForm  "garden maintenance trainee"@en .
  `
  )
  const writer = N3.Writer({ format: 'application/n-quads' })
  writer.addQuads(rdf)
  const nQuads = await new Promise((resolve, reject) => {
    writer.end(async (error, nQuads) => {
      if (error) {
        reject(error)
      }
      resolve(nQuads)
    })
  })
  const content = await jsonld.fromRDF(nQuads, {
    format: 'application/n-quads',
  })
  ctx.body = JSON.stringify(content)
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
