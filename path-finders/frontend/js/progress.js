const subjects=['Accounting','Economics','Third Subject'];
const demoRows=[]; // Deliberately empty: production charts must use database results, not fake data.
const monthlyCtx=document.getElementById('monthlyChart'); if(monthlyCtx)new Chart(monthlyCtx,{type:'line',data:{labels:[],datasets:[]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true}}}});
const termCtx=document.getElementById('termChart'); if(termCtx)new Chart(termCtx,{type:'line',data:{labels:[],datasets:[]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true}}}});
