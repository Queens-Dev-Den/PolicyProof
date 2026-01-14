REPORT_TOOL = {
    "name": "generate_policy_report",
    "description": "Generates a structured list of compliance and violation findings from a document.",
    "input_schema": {
        "type": "object",
        "properties": {
            "findings": {
                "type": "array",
                "description": "A list of all identified compliance and violation points.",
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": ["VIOLATION", "COMPLIANCE"],
                            "description": "Whether this finding is an error (red) or compliant (green)."
                        },
                        "title": {
                            "type": "string", 
                            "description": "The header text (e.g., 'Data Retention Error' or 'Security Measures Compliant')."
                        },
                        "section": {
                            "type": "string",
                            "description": "The specific section identifier from the document (e.g., 'Section 2')."
                        },
                        "message": {
                            "type": "string",
                            "description": "The detailed explanation of the finding or compliance."
                        },
                        "policy_reference": {
                            "type": "string",
                            "description": "The specific policy or law referenced (e.g., 'GDPR Article 5(1)(e)' or 'ISO 27001')."
                        },
                        "location_metadata": {
                            "type": "object",
                            "description": "Metadata for referencing the finding's location in the document.",
                            "properties": {
                                "page_number": {"type": "integer", "description": "The page number where this finding appears."},
                                "exact_quote": {"type": "string", "description": "The exact text excerpt from the document."}
                            },
                            "required": ["page_number", "exact_quote"]
                        }
                    },
                    "required": ["type", "title", "section", "message", "location_metadata"]
                }
            }
        },
        "required": ["findings"]
    }
}

ASSISTANT_RESPONSE_TOOL = {
    "name": "provide_policy_guidance",
    "description": "Provides policy guidance and answers questions about compliance frameworks with references.",
    "input_schema": {
        "type": "object",
        "properties": {
            "answer": {
                "type": "string",
                "description": "The detailed answer to the user's question about policy frameworks and compliance."
            },
            "referenced_frameworks": {
                "type": "array",
                "description": "List of compliance frameworks referenced in the answer (e.g., ['GDPR', 'HIPAA']).",
                "items": {
                    "type": "string"
                }
            },
            "relevant_articles": {
                "type": "array",
                "description": "List of specific articles, clauses, or sections cited in the answer.",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "The article or clause title (e.g., 'GDPR Art. 5 – Storage Limitation')"
                        },
                        "source": {
                            "type": "string",
                            "description": "The framework this article belongs to (e.g., 'GDPR')"
                        },
                        "url": {
                            "type": "string",
                            "description": "A direct URL link to the official article or regulation text"
                        }
                    },
                    "required": ["title", "source", "url"]
                }
            }
        },
        "required": ["answer", "referenced_frameworks", "relevant_articles"]
    }
}