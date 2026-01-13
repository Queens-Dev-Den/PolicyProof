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
                            "description": "Data used for the 'View in document' link to highlight the correct area.",
                            "properties": {
                                "page_number": {"type": "integer"},
                                "exact_quote": {"type": "string", "description": "The text to highlight in the PDF."},
                                "bounding_box": {
                                    "type": "object",
                                    "description": "Coordinates for highlighting the text on the PDF page.",
                                    "properties": {
                                        "x": {"type": "number", "description": "X coordinate from left (pixels)"},
                                        "y": {"type": "number", "description": "Y coordinate from top (pixels)"},
                                        "width": {"type": "number", "description": "Width of the box (pixels)"},
                                        "height": {"type": "number", "description": "Height of the box (pixels)"}
                                    },
                                    "required": ["x", "y", "width", "height"]
                                }
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