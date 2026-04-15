# Bugfix Requirements Document

## Introduction

The Line Free India app builds successfully in local development but fails during Vercel deployment with multiple critical issues. These failures prevent the production deployment from completing successfully, resulting in either build errors or runtime errors that cause a black screen for users. The primary issues are:

1. **Duplicate i18n translation keys** causing TypeScript compilation errors
2. **React bundling configuration** causing production runtime errors with undefined React context
3. **Vite configuration issues** that may not be optimized for Vercel's build environment

This bugfix addresses all deployment blockers to ensure the app builds and runs successfully on Vercel.

---

## Bug Analysis

### Current Behavior (Defect)

**1.1** WHEN the TypeScript compiler processes `src/i18n.ts` during Vercel build THEN the system fails with error "An object literal cannot have multiple properties with the same name" for the `nextCustomer` key (appears at lines 46, 197 in English and lines 269, 420 in Hindi)

**1.2** WHEN the production build is deployed to Vercel THEN the system throws runtime error `Uncaught TypeError: Cannot read properties of undefined (reading 'createContext')` causing the app to display a black screen

**1.3** WHEN Vite bundles React dependencies for production THEN the system may incorrectly split React core modules across multiple chunks causing `Cannot set properties of undefined (setting 'Activity')` errors

**1.4** WHEN Vercel attempts to build the project THEN the build may fail or produce a broken production bundle even though local builds succeed

### Expected Behavior (Correct)

**2.1** WHEN the TypeScript compiler processes `src/i18n.ts` during Vercel build THEN the system SHALL compile successfully without duplicate key errors (each translation key must appear exactly once per language)

**2.2** WHEN the production build is deployed to Vercel THEN the system SHALL load the app without React context errors and display the UI correctly

**2.3** WHEN Vite bundles React dependencies for production THEN the system SHALL keep React core modules (`react` and `react-dom`) in a single chunk to prevent module initialization issues

**2.4** WHEN Vercel attempts to build the project THEN the build SHALL complete successfully and produce a working production bundle identical to local builds

### Unchanged Behavior (Regression Prevention)

**3.1** WHEN the app is built locally using `npm run build` THEN the system SHALL CONTINUE TO build successfully without errors

**3.2** WHEN users access non-affected translation keys in the i18n system THEN the system SHALL CONTINUE TO return the correct translated strings

**3.3** WHEN the app runs in development mode (`npm run dev`) THEN the system SHALL CONTINUE TO function normally with hot module replacement

**3.4** WHEN React components use hooks and context APIs THEN the system SHALL CONTINUE TO work correctly in both development and production

**3.5** WHEN the PWA service worker caches assets THEN the system SHALL CONTINUE TO respect the 6MB file size limit configured in vite.config.ts

**3.6** WHEN non-React vendor libraries (Firebase, Framer Motion, Recharts, Leaflet) are bundled THEN the system SHALL CONTINUE TO be split into appropriate chunks as currently configured

---

## Bug Condition Analysis

### Bug Condition Function

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type BuildEnvironment
  OUTPUT: boolean
  
  // Returns true when deployment bugs are triggered
  RETURN (X.hasDuplicateI18nKeys = true) OR 
         (X.reactBundlingBroken = true) OR
         (X.environment = "vercel-production")
END FUNCTION
```

### Property Specification

```pascal
// Property: Fix Checking - Deployment Success
FOR ALL X WHERE isBugCondition(X) DO
  result ← buildAndDeploy'(X)
  ASSERT result.buildSuccess = true AND
         result.noDuplicateKeys = true AND
         result.reactContextWorks = true AND
         result.appLoadsCorrectly = true
END FOR
```

### Preservation Goal

```pascal
// Property: Preservation Checking - Local Development Unchanged
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT buildAndDeploy(X) = buildAndDeploy'(X)
END FOR
```

This ensures that local development builds, non-affected translations, and existing functionality remain unchanged after the fix.

---

## Root Cause Summary

| Issue | Root Cause | Impact |
|-------|-----------|--------|
| Duplicate i18n keys | `nextCustomer` key defined twice in both English and Hindi translation objects | TypeScript compilation failure on Vercel |
| React bundling errors | Vite's `manualChunks` configuration may split React core across multiple chunks | Runtime error: "Cannot read properties of undefined (reading 'createContext')" |
| Vercel-specific failures | Build environment differences between local and Vercel (caching, Node version, build optimization) | Successful local builds but failed Vercel deployments |

---

## Verification Criteria

After applying the fix:

1. ✅ `npm run build` completes without TypeScript errors
2. ✅ No duplicate key errors in `src/i18n.ts`
3. ✅ Vercel deployment builds successfully
4. ✅ Production app loads without black screen
5. ✅ No React context errors in browser console
6. ✅ All translation keys work correctly
7. ✅ Local development continues to work normally
