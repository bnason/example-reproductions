import { join } from 'node:path'

import { getSyntaxKindName } from '@ts-morph/common'
import { ExportAssignment, Project, ts } from 'ts-morph'

const project = new Project({
	compilerOptions: {
		moduleResolution: ts.ModuleResolutionKind.NodeNext,
	},
})
const typeChecker = project.getTypeChecker()

try {
	const typeSource = `const foo: string = 'bar'
export default foo`
	console.log('typeSource', typeSource)

	const typeSourceFileName = join('types', `foo.ts`)
	console.log('typeSourceFileName', typeSourceFileName)

	const typeSourceFile = project.createSourceFile(typeSourceFileName, typeSource, { overwrite: true })

	const defaultExport = typeSourceFile.getDefaultExportSymbol()
	if (!defaultExport) {
		throw new Error('defaultExport is null')
	}

	const declarations = defaultExport.getDeclarations()
	console.log('declarations length', declarations.length)
	if (!declarations) {
		throw new Error('declarations is null')
	}

	const declaration = declarations[0]
	if (!declaration) {
		throw new Error('declaration is null')
	}

	const exportType = typeChecker.getTypeAtLocation(declaration)
	// const exportType = declaration.getType()
	if (!exportType) {
		throw new Error('exportType is null')
	}

	console.log('exportTypeText', exportType.getText())

	if (exportType.isAny()) {
		console.log('exportType is any')
	}
}
catch (error) {
	console.error('Error parsing API', error)
}