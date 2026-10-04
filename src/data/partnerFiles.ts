export const PRODUCT_KINDS = [
 {value:'template',ar:'قالب جاهز',en:'Template'}, {value:'book',ar:'كتاب أو دليل رقمي',en:'Book or guide'},
 {value:'video',ar:'فيديو',en:'Video'}, {value:'image',ar:'صور أو تصاميم',en:'Images or designs'},
 {value:'course',ar:'دورة أو مادة تعليمية',en:'Course or learning material'}, {value:'software',ar:'أداة أو برنامج',en:'Tool or software'},
 {value:'asset',ar:'موقع أو أصل رقمي مسموح نقله',en:'Transferable digital asset'}, {value:'other',ar:'منتج رقمي آخر',en:'Other digital product'},
];
export const PREVIEW_MAX_BYTES = 25*1024*1024;
export const PREVIEW_MIMES: Record<string,string> = {
 jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',
 mp4:'video/mp4',webm:'video/webm',pdf:'application/pdf',zip:'application/zip',
 docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
 pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',
 doc:'application/msword',xls:'application/vnd.ms-excel',ppt:'application/vnd.ms-powerpoint',
 psd:'application/octet-stream',ai:'application/postscript',fig:'application/octet-stream',sketch:'application/octet-stream',
};
export function previewFileType(name:string,size:number){
 const ext=name.split('.').pop()?.toLowerCase()||'',mime=PREVIEW_MIMES[ext];
 if(!mime)throw new Error('نوع الملف غير مدعوم. اجمع ملفات القالب داخل ZIP.');
 if(!Number.isSafeInteger(size)||size<1||size>PREVIEW_MAX_BYTES)throw new Error('الحد الأقصى للملف 25 ميجابايت.');
 return {ext,mime};
}
