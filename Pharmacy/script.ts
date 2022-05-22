type Medicine = {
  id : string;
  name :string;
  rack : string;
  shelf :string;
  capacity : number;
  availableQuantity : number;
}

var medicinesNameList = [
  "Stavudine","Sucralfate","Sugammadex","Abacavir","Acyclovir","Alemtuzumab","Alendronate","Allopurinol","Amifostine","Amikacin",
  "Aminocaproic Acid","Amitriptyline","Amlodipine","Amoxicillin","Paracetamol","Amphotericin","Ampicillin","Baclofen","Bleomycin","Bortezomib",
  "Bosentan","Busulfan","Calcium","Captopril","Carbamazepine","Carboplatin","Carmustine","Cefaclor","Cefepime","Cefixime",
  "Ceftazidime","Cefuroxime","Celecoxib","Cephalexin","Cidofovir","Cisplatin","Cladribine","Clarithromycin","Clindamycin","Clobazam",
  "Clofarabine","Codeine","Crizanlizumab","Crizotinib","Cyclobenzaprine","Cyclophosphamide","Cyclosporine","Cyproheptadine","Cytarabine","Dacarbazine",
  "Dactinomycin","Dapsone","Diclofenac","Didanosine","Dinutuximab","Dobutamine","Dopamine","Dornase alfa","Doxorubicin","Dronabinol",
  "Enalapril","Enoxaparin","Erlotinib","Erythromycin","Erythropoietin","Etonogestrel","Etoposide","Etravirine","Famciclovir","Famotidine",
  "Fidaxomicin","Fluconazole","Fludarabine","Fluorouracil","Foscarnet","Furosemide","Gabapentin","Ganciclovir","Gefitinib","Gemcitabine",
  "Granisetron","Hydrocortisone","Hydromorphone","Hydroxyurea","Irinotecan","Isotretinoin","Itraconazole","Ketoconazole","Levothyroxine","Linezolid",
  "Lomustine","Lorazepam","Lorlatinib","Melphalan","Meperidine","Mercaptopurine","Meropenem","Mesna","Methadone","Methotrexate"
] 
var searchWord :string;
var activeRack:string;
var containerDetails :Medicine;
var container :HTMLElement;
var salesQuantity : number;
var searchMedicineInput : HTMLElement;
var salesMedicineQuantity: HTMLElement;
var billForm :HTMLElement;
var errorValue : HTMLElement;
var pathDetail : HTMLElement;
var medicineName : HTMLElement;
var medicineCapacity : HTMLElement;
var medicineQuantity : HTMLElement;
var blinkContainer : HTMLElement;
var listContainer : HTMLElement;
var datalist : HTMLElement;
var root = document.documentElement;
var currentRack:number;
var selectedMedicineClass:string;
var medicineId:string;
/**
 * Initial function.
 */
(function () {
   searchMedicineInput = document.querySelector(".searchMedicine");
   salesMedicineQuantity = document.getElementById("salesQuantity");
   billForm = document.getElementById("billform");
   errorValue = document.getElementById("error");
   pathDetail = document.getElementById("path");
   medicineName = document.getElementById("medName");
   medicineCapacity = document.getElementById("medCapacity");
   medicineQuantity = document.getElementById("medQuantity");
   listContainer = document.getElementById("listContainer");
   root = document.documentElement;
   datalist = document.getElementById("medicine");
   selectedMedicineClass="";
   searchMedicineInput.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
      event.preventDefault();
      document.getElementById("searchBtn").click();
    }
  });
  
  salesMedicineQuantity.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
      event.preventDefault();
      document.getElementById("submitSalesBtn").click();
    }
  })
})();
/**
 * 
 * To generate medicine storage details.
 */
var shelfCount : number = 0;
var rackDetails = new Array();
var medicines = medicinesNameList.map(function(medicineName, index) : Medicine{
  var rackName : string = "rack_"+ (Math.floor(index/20) + 1);
  if(rackDetails.indexOf(rackName)===-1){
      rackDetails.push(rackName);
  }
  if(index%20==0){
      shelfCount=0;
    }
  var shelfName :string = "shelf_"+(Math.floor(shelfCount/5) + 1);
  shelfCount++;
      return {
          id : "medicine_"+(index+1),
          name : medicineName,
          rack : rackName,
          shelf : shelfName,
          capacity : 100,
          availableQuantity : 100
      };
});
showMedicineList();

/**
 * 
 * @param searchWord to find the medicine detail object.
 * @returns Matched medicine detail of the searchword.
 */

function findMedicineDetail(searchWord:string) : Medicine{
  var searchedMedicineDetails =medicines.filter(function(medicineName){
    return medicineName.name.toLowerCase()===searchWord.toLowerCase();
  });
  if(searchedMedicineDetails[0]){
    return searchedMedicineDetails[0];
  }else{
    alert("This medicine is not available");
    clearDetails();
  }
}
/**
 * 
 * To highlight the rack and container which is mathched with searchMedicine.
 */
function highlightRack(){
  if(activeRack){
    container && container.classList.remove("containerStyle");
    billForm.style.display = "none";
  }
  searchWord  = (searchMedicineInput as HTMLInputElement).value;
  if(searchWord===""){
    alert("Medicine name can't be empty");
    clearDetails();
  }
  else{
    activeRack = searchWord;
    containerDetails  = findMedicineDetail(searchWord);
    if(containerDetails){
      var rackId :string = containerDetails.rack;
      var medicineId :string = containerDetails.id;
      var shelfId :string = containerDetails.shelf;
      for(var i=0;i<rackDetails.length;i++){
        if(rackId===rackDetails[i]){
          container = document.getElementById(medicineId);
          container && container.classList.add("containerStyle");
          pathDetail.innerHTML = "Medicine Path : "+rackId+" - "+shelfId+" - "+medicineId;
          pathDetail.style.display = "flex";
          currentRack = i;
          root.style.setProperty("--currentRack", currentRack.toString());
        }
      }
      billingForm();
    }
  }
  showMedicineList();
}

/**
 * To clear previously searched medicine details.
 */
function clearDetails(){
  (searchMedicineInput as HTMLInputElement).value = '';
  container && container.classList.remove("containerStyle"); 
  searchWord = "";
  pathDetail.style.display = "none";
  billForm.style.display = "none";
  errorValue.style.display = "none";
  currentRack = 0;
  root.style.setProperty("--currentRack", currentRack.toString());
  showMedicineList();
}
/**
 * Enable billing form and show the medicine details.
 */
function billingForm(){
  billForm.style.display = "block";
  medicineName.innerHTML  = containerDetails.name;
  medicineCapacity.innerHTML = containerDetails.capacity+'';
  medicineQuantity.innerHTML = containerDetails.availableQuantity+'';
  errorValue.style.display = "none";
}
/**
 * Calculate and show current availability of Medicines.
 */
function salesMedicine(){
  let valueCheck = (salesMedicineQuantity as HTMLInputElement).value;
  if(valueCheck){
    salesQuantity = parseInt((salesMedicineQuantity as HTMLInputElement).value);
    if(salesQuantity > containerDetails.availableQuantity){
      errorValue.style.display = "block";
      errorValue.innerHTML = "Error: Only "+containerDetails.availableQuantity+" medicines are available."
    }
    else if(salesQuantity <= 0){
      errorValue.style.display = "block";
      errorValue.innerHTML = "Error: Enter valid number";
    }
    else{
      errorValue.style.display = "none";
      containerDetails.availableQuantity = containerDetails.availableQuantity - salesQuantity;
      medicineQuantity.innerHTML = containerDetails.availableQuantity+'';
      var validateQuantity = (30 * containerDetails.capacity)/100;
      if(containerDetails.availableQuantity < validateQuantity){
        blinkAlert(containerDetails.id);
      }
      showMedicineList();
    }
  }
  else{
    errorValue.style.display = "block";
    errorValue.innerHTML = "Error: You must enter the number";
  }
  (salesMedicineQuantity as HTMLInputElement).value = '';
}
/**
 * 
 * @param containerId to find minimum quantity container.
 * Blink the container which is in below 30% of its capacity.
 */

function blinkAlert(containerId : string){
  blinkContainer = document.getElementById(containerId);
  blinkContainer.classList.add("blinkContainer");
}
/**
 * To show all medicine name and its available quantity.
 */
function showMedicineList(){
  // listContainer.style.display = "grid";
  var headerHtml = "<div class='listHeader boldText'><div class='listStyle flex'>Medicine Name</div><div class='listStyle flex'>Available Quantity<span class='material-icons-outlined iconpad' onclick='sortMedicineListAscending()' title='Ascending Order'>arrow_upward</span><span class='material-icons-outlined iconpad' onclick='sortMedicineListDescending()' title='Descending Order'>arrow_downward</span></div></div>";
  var contentHtml = "<div class='medicineList'>";
  for(var i=0; i<medicines.length; i++){
    var medicineName = medicines[i].name;
    var availQuantity = medicines[i].availableQuantity.toString();
    var validateQuantity = (30 * medicines[i].capacity)/100;
    var minimumQuantityClass = "";
    if(searchWord){
      if(medicines[i].name.toLowerCase() === searchWord.toLowerCase()){
        selectedMedicineClass = "contStyle";
      }
      else{
        selectedMedicineClass = "";
      }
    }
    else{
      selectedMedicineClass = "";
    }
    if(medicines[i].availableQuantity < validateQuantity){
      minimumQuantityClass = "minimumQuantity";
    }
    medicineId = "med_"+(i+1);
    contentHtml += "<div class='listHeader' id="+medicineId+" onclick='selectMedicine(this.id)'><div class='listStyle flex "+minimumQuantityClass+" "+selectedMedicineClass+"'>"+medicineName+"</div><div class='listStyle flex "+minimumQuantityClass+" "+selectedMedicineClass+"'>"+availQuantity+"</div></div>"
  }
  contentHtml += "</div>";
  listContainer.innerHTML = headerHtml + contentHtml;
}
/**
 * Sort medicine details by available quantity (Ascending).
 */
function sortMedicineListAscending(){
  medicines.sort(function(a,b){
    return a.availableQuantity - b.availableQuantity;
  });
  showMedicineList();
}
/**
 * Sort medicine details by available quantity (Descending).
 */
function sortMedicineListDescending(){
  medicines.sort(function(a,b){
    return b.availableQuantity - a.availableQuantity;
  });
  showMedicineList();
}
/**
 * To navigate previous racks.
 */
function showPreviousRack(){
  if(currentRack){
    if(currentRack===0){
      alert("There is no previous rack.");
    }
    else {
      currentRack = currentRack-1;
      root.style.setProperty("--currentRack",currentRack.toString());
    }
  }
  else{
    alert("There is no previous rack.");
    currentRack = 0;
  }
}
/**
 * To navigate next racks.
 */
function showNextRack(){
  if(currentRack){
    if(currentRack===rackDetails.length-1){
      alert("There is no next rack.");
    }
    else {
      currentRack = currentRack+1;
      root.style.setProperty("--currentRack",currentRack.toString());
    }
  }
  else{
    currentRack = 1;
    root.style.setProperty("--currentRack",currentRack.toString());
  }
}
/**
 * 
 * @param medicineId to get the text value from list.
 * select the medicine by clicking the list. 
 */
function selectMedicine(medicineId){
  let medicineName:string = document.getElementById(medicineId).firstChild.textContent;
  (searchMedicineInput as HTMLInputElement).value=medicineName;
  highlightRack();
}