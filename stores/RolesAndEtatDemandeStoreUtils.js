import {defineStore} from "pinia";

export let useRolesAndEtatDemandeUtilsStore = defineStore('rolesAndEtatDemandeUtils', {
    state() {
        return null;
    },

    actions: {
        isResponsableQualiteFormationFunc(roleName) {
            return roleName?.toLowerCase()?.includes('responsable') && roleName?.toLowerCase()?.includes('qualit') && roleName?.toLowerCase()?.includes('formation')
        },
        isCoordinatorQualiteFormationFunc(roleName) {
            return roleName?.toLowerCase()?.includes('coordinateur') && roleName?.toLowerCase()?.includes('qualit') && roleName?.toLowerCase()?.includes('formation')
        },
        isDirectorFunc(roleName) {
            return roleName?.toLowerCase() === 'directeur'
        },
        isDataProtectionOfficerFunc(roleName) {
            return roleName?.toLowerCase().includes('data') && roleName?.toLowerCase().includes('officer') && roleName?.toLowerCase().includes('protection')
        },
        isChargeMissionAupresDirectionFunc(roleName) {
            return roleName?.toLowerCase().includes('charg') && roleName?.toLowerCase().includes('direction')
        },
        isRespRHFunc(roleName) {
            return roleName?.toLowerCase()?.includes('responsable rh')
        },
        isChargeFormationFunc(roleName) {
            return roleName?.toLowerCase()?.includes('charg') && roleName?.toLowerCase()?.includes('formation')
        },
        isChargeCommMarketingFunc(roleName) {
            return roleName?.toLowerCase()?.includes('charg') && roleName?.toLowerCase()?.includes('marketing')
        },
        isChargeRHFunc(roleName) {
            return roleName?.toLowerCase()?.includes('charg') && roleName?.toLowerCase()?.includes('rh')
        },
        isRespMGFunc(roleName) {
            return roleName?.toLowerCase().includes('responsable') && roleName?.toLowerCase().includes('moyens')
        },
        isChargeRecrutementFunc(roleName) {
            return roleName?.toLowerCase().includes('charg') && roleName?.toLowerCase().includes('recrutement')
        },
        isChargeQualiteProcessFunc(roleName) {
            return roleName?.toLowerCase().includes('charg') && roleName?.toLowerCase().includes('process')
        },
        isHeadOfOperationalExcellenceFunc(roleName) {
            return roleName?.toLowerCase()?.includes('head of operational excellence')
        },
        isInfirmiereDeTravailFunc(roleName) {
            return roleName?.toLowerCase().includes('infirm')
        },
        isCCIFunc(roleName) {
            return roleName?.toLowerCase()?.includes('incoh')
        },
        isCPSFunc(roleName) {
            return roleName?.toLowerCase()?.includes('statis')
        },
        isVigieFunc(roleName) {
            return roleName?.toLowerCase()?.includes('vigie')
        },
        isSupervisorFunc(roleName) {
            return roleName?.toLowerCase()?.includes('superviseur')
        },
        isRespITFunc(roleName) {
            return roleName?.toLowerCase()?.includes('responsable it')
        },
        isCoordinatorCPSFunc(roleName) {
            return roleName?.toLowerCase()?.includes('coordinateur cps')
        },
        isCoordinatorVigieFunc(roleName) {
            return roleName?.toLowerCase()?.includes('coordinateur vigie')
        },
        isOpsManagerFunc(roleName) {
            return roleName?.toLowerCase()?.includes('opération')
        },
        isAgentFunc(roleName) {
            return roleName?.toLowerCase().includes('conseiller') || roleName?.toLowerCase().includes('agent')
        },
        isITAgentFunc(roleName) {
            return roleName?.toLowerCase()?.includes('informaticien') || roleName?.toLowerCase()?.includes('stagiaire it') || roleName?.toLowerCase()?.includes('admin') || roleName?.toLowerCase()?.includes('miner') || roleName?.toLowerCase()?.includes('sys') && roleName?.toLowerCase()?.includes('info')
        },
        isCreated(demand) {
            return demand?.demand?.etat_demande === 'created'
        },
        isValidatedBySupervisor(demand) {
            return demand?.demand?.etat_demande === 'validated by supervisor'
        },
        isValidatedByWFM(demand) {
            return demand?.demand?.etat_demande === 'validated by wfm' || demand?.demand?.etat_demande === 'validated by vigie' || demand?.demand?.etat_demande === 'validated by coordinateur vigie' || demand?.demand?.etat_demande === 'validated by cci' || demand?.demand?.etat_demande === 'validated by cps' || demand?.demand?.etat_demande === 'validated by coordinateur cps' || demand?.demand?.etat_demande === 'validated by head of operational excellence'
        },
        isValidatedByAgentWFM(demand) {
            return demand?.demand?.etat_demande === 'validated by vigie' || demand?.demand?.etat_demande === 'validated by cps'
        },
        isValidatedByCoordinatorWFM(demand) {
            return demand?.demand?.etat_demande === 'validated by coordinateur vigie' || demand?.demand?.etat_demande === 'validated by coordinateur cps'
        },
        isValidatedByOpsManager(demand) {
            return demand?.demand?.etat_demande === 'validated by ops manager'
        },
        isValidatedByDirector(demand) {
            return demand?.demand?.etat_demande === 'validated by director'
        },
        isValidatedByRespIT(demand) {
            return demand?.demand?.etat_demande === 'validated by resp it'
        },
        isValidatedByCoordinatorQualiteFormation(demand) {
            return demand?.demand?.etat_demande === 'validated by coordinateur qualite formation'
        },
        isValidatedByResponsableQualiteFormation(demand) {
            return demand?.demand?.etat_demande === 'validated by responsable qualite formation'
        },
        isValidatedByRespRH(demand) {
            return demand?.demand?.etat_demande === 'validated by resp hr'
        },
        isClosed(demand) {
            return demand?.demand?.etat_demande?.toLowerCase()?.includes('closed')
        }
    }
})
