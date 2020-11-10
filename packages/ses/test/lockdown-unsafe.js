// Like ./lockdown.js, this module calls lockdown except with safeties off, so
// that lockdown can be called before importing other modules.
// Either ../ses.js or ../lockdown.js must be imported before this module to
// shim `lockdown`.
lockdown({
  dateTaming: 'unsafe',
  mathTaming: 'unsafe',
  errorTaming: 'unsafe',
});
